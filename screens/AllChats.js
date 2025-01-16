import { useNavigation } from "@react-navigation/native";
import { Text, View, StyleSheet, FlatList } from "react-native";
import { users } from "../backend"; // Import the messages and users from backend
import ChatItem from "../components/ChatItem";
import { useContext, useEffect } from "react";
import { AppContext } from "../store/app-context";

function AllChats() {
  const navigation = useNavigation();
  const { currentUserId, fetchMessagesBetweenUsers, messages } =
    useContext(AppContext);

  // Function to get the latest message between currentUser and a given receiver
  const getLatestMessage = (receiverId) => {
    // Filter messages between currentUser and receiver
    const filteredMessages = fetchMessagesBetweenUsers(
      currentUserId,
      receiverId
    );

    // Sort the messages by sentAt (newest first)
    const sortedMessages = filteredMessages.sort((a, b) => {
      const dateA = new Date(a.sentAt);
      const dateB = new Date(b.sentAt);
      return dateB - dateA; // Sort by date in descending order (newest first)
    });

    // Return the latest message or a placeholder if no messages exist
    return sortedMessages.length > 0 ? sortedMessages[0] : null;
  };

  // Function to filter users that have at least one message with the currentUser
  const getUsersWithMessages = () => {
    // Filter users to get only those with whom the currentUser has exchanged messages
    return users.filter((user) => {
      // Find the messages exchanged between currentUser and this user
      const receiverInfo = user;

      const hasMessages = messages.some(
        (message) =>
          (message.senderId === currentUserId &&
            message.receiverId === receiverInfo.id) ||
          (message.senderId === receiverInfo.id &&
            message.receiverId === currentUserId)
      );

      return hasMessages; // Only return users with whom there are messages
    });
  };

  // Function to navigate to the ChatScreen
  const navigateToChat = (receiverId) => {
    navigation.navigate("ChatScreen", {
      receiverId: receiverId,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chats</Text>
      <FlatList
        data={getUsersWithMessages()} // Only show users who have exchanged messages with currentUser
        renderItem={({ item }) => {
          // Get the latest message for each chat
          const latestMessage = getLatestMessage(item.id);

          return (
            <ChatItem
              name={item.username}
              profilePhoto={item.profilePhoto}
              recentMessage={latestMessage.message || "No message"} // Pass the latest message to ChatItem
              onPress={() => navigateToChat(item.id)} // Navigate to chat screen
              isSent={latestMessage.senderId === currentUserId}
            />
          );
        }}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
});

export default AllChats;
