import { useContext, useState } from "react";
import {
  Text,
  View,
  FlatList,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { users } from "../backend"; // Import the messages and users from backend
import { useLayoutEffect } from "react";
import { AppContext } from "../store/app-context";

function ChatScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { currentUserId, addMessage, fetchMessagesBetweenUsers } =
    useContext(AppContext);
  const { receiverId } = route.params;

  const [newMessage, setNewMessage] = useState(""); // State for the input message

  useLayoutEffect(() => {
    navigation.setOptions({ title: receiverInfo.username });
  }, [receiverId]);

  // Find the receiver's information (username, profile photo)
  const receiverInfo = users.find((user) => user.id === receiverId);
  const currentUserInfo = users.find((user) => user.id === currentUserId);

  // Filter messages between currentUser and receiver
  let filteredMessages = fetchMessagesBetweenUsers(currentUserId, receiverId);

  const sortedMessages = filteredMessages.sort((a, b) => {
    const dateA = new Date(a.sentAt);
    const dateB = new Date(b.sentAt);
    return dateA - dateB; // Sort by date (ascending)
  });

  const renderItem = ({ item }) => {
    // Check if the current message was sent by the currentUser
    const isCurrentUser = item.senderId === currentUserInfo.id;

    return (
      <View
        style={[
          styles.messageContainer,
          isCurrentUser ? styles.currentUserMessage : styles.receiverMessage,
        ]}
      >
        {!isCurrentUser && (
          <Image
            source={{ uri: receiverInfo.profilePhoto }}
            style={styles.profileImage}
          />
        )}
        <View
          style={[
            styles.messageBubble,
            isCurrentUser && styles.currentUserBubble,
          ]}
        >
          <Text style={styles.messageText}>{item.message}</Text>
        </View>
        {isCurrentUser && (
          <Image
            source={{ uri: currentUserInfo.profilePhoto }}
            style={styles.profileImage}
          />
        )}
      </View>
    );
  };

  // Function to handle sending messages
  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const newMsg = {
        id: Date.now(), // Use a unique ID
        senderId: currentUserId,
        receiverId: receiverId,
        message: newMessage.trim(),
        sentAt: new Date().toISOString(),
      };

      addMessage(newMsg); // Add to context
      setNewMessage(""); // Clear input
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={sortedMessages}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 10 }} // Adds some space at the bottom of the FlatList
      />
      {/* Input and Send Button */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Type your message..."
          value={newMessage}
          onChangeText={setNewMessage}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
          <Text style={styles.sendButtonText}>→</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  messageContainer: {
    flexDirection: "row",
    marginBottom: 15,
    alignItems: "flex-start", // Aligns profile image and messages vertically
  },
  currentUserMessage: {
    justifyContent: "flex-end", // Messages from the current user are aligned to the right
    flexDirection: "row", // Ensures current user's messages are on the right side
  },
  receiverMessage: {
    justifyContent: "flex-start", // Messages from the receiver are aligned to the left
    flexDirection: "row", // Receiver's messages are on the left side
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginHorizontal: 8,
  },
  messageBubble: {
    backgroundColor: "#f1f1f1", // Light background for receiver messages
    padding: 10,
    borderRadius: 15,
    maxWidth: "75%", // Ensures messages are not too wide
  },
  currentUserBubble: {
    backgroundColor: "#0078d4", // Blue color for current user's messages
  },
  messageText: {
    color: "#000",
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    backgroundColor: "#fff",
  },
  textInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: "#0078d4",
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default ChatScreen;
