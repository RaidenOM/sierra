import { useNavigation } from "@react-navigation/native";
import { Text, View, StyleSheet, FlatList } from "react-native";
import { users } from "../backend";
import ChatItem from "../components/ChatItem";
import { useContext, useEffect } from "react";
import { AppContext } from "../store/app-context";

function AllChats() {
  const navigation = useNavigation();
  const { currentUserId, fetchMessagesBetweenUsers, messages } =
    useContext(AppContext);

  // Function to get the latest message between currentUser and a given receiver
  const getLatestMessage = (receiverId) => {
    const filteredMessages = fetchMessagesBetweenUsers(
      currentUserId,
      receiverId
    );

    const sortedMessages = filteredMessages.sort((a, b) => {
      const dateA = new Date(a.sentAt);
      const dateB = new Date(b.sentAt);
      return dateB - dateA;
    });

    return sortedMessages.length > 0 ? sortedMessages[0] : null;
  };

  // Function to filter users that have at least one message with the currentUser
  const getUsersWithMessages = () => {
    return users.filter((user) => {
      const receiverInfo = user;

      const hasMessages = messages.some(
        (message) =>
          (message.senderId === currentUserId &&
            message.receiverId === receiverInfo.id) ||
          (message.senderId === receiverInfo.id &&
            message.receiverId === currentUserId)
      );

      return hasMessages;
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
        data={getUsersWithMessages()}
        renderItem={({ item }) => {
          const latestMessage = getLatestMessage(item.id);

          return (
            <ChatItem
              name={item.username}
              profilePhoto={item.profilePhoto}
              recentMessage={latestMessage.message || "No message"}
              onPress={() => navigateToChat(item.id)}
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
