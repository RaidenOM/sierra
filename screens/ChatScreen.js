import { useContext, useState, useEffect, useLayoutEffect } from "react";
import {
  Text,
  View,
  FlatList,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import axios from "axios";
import { UserContext } from "../store/user-context";

function ChatScreen() {
  const route = useRoute();
  const { user } = useContext(UserContext);
  const { receiverId } = route.params;

  const [receiver, setReceiver] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch receiver information
  useEffect(() => {
    async function findReceiverInfo() {
      try {
        const response = await axios.get(
          `http://192.168.31.6:3000/users/${receiverId}`
        );
        setReceiver(response.data);
      } catch (error) {
        console.error("Error fetching receiver info", error);
      }
    }
    findReceiverInfo();
  }, [receiverId]);

  // Fetch messages between the current user and the receiver
  useEffect(() => {
    async function fetchMessages() {
      try {
        const response = await axios.get(
          `http://192.168.31.6:3000/messages/${user._id}/${receiverId}`
        );
        setMessages(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching messages", error);
      }
    }

    if (receiver) {
      fetchMessages();
    }
  }, [user.id, receiverId, receiver]);

  // Sort messages based on sentAt field
  const sortedMessages = messages.sort((a, b) => {
    const dateA = new Date(a.sentAt);
    const dateB = new Date(b.sentAt);
    return dateA - dateB;
  });

  // Helper function to format dates
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "short",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const renderItem = ({ item, index }) => {
    const isCurrentUser = item.senderId === user._id;

    // Format the timestamp
    const formattedTime = new Date(item.sentAt).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    // Check if the current message is the first of a new day
    const showDateSeparator =
      index === 0 ||
      formatDate(sortedMessages[index].sentAt) !==
        formatDate(sortedMessages[index - 1].sentAt);

    return (
      <>
        {showDateSeparator && (
          <View style={styles.dateSeparator}>
            <Text style={styles.dateText}>{formatDate(item.sentAt)}</Text>
          </View>
        )}
        <View
          style={[
            styles.messageContainer,
            isCurrentUser ? styles.currentUserMessage : styles.receiverMessage,
          ]}
        >
          {!isCurrentUser && (
            <Image
              source={{ uri: receiver.profilePhoto }}
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
            <Text style={styles.timestamp}>{formattedTime}</Text>
          </View>
          {isCurrentUser && (
            <Image
              source={{ uri: user.profilePhoto }}
              style={styles.profileImage}
            />
          )}
        </View>
      </>
    );
  };

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      const message = {
        senderId: user._id,
        receiverId: receiverId,
        message: newMessage.trim(),
      };

      try {
        const response = await axios.post(
          "http://192.168.31.6:3000/messages",
          message
        );
        setMessages((prevMessages) => [
          ...prevMessages,
          response.data.savedMessage,
        ]);
        setNewMessage(""); // Clear input after sending
      } catch (error) {
        console.error("Error sending message", error);
      }
    }
  };

  if (loading) {
    return <Text>Loading messages...</Text>;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={sortedMessages}
        renderItem={renderItem}
        keyExtractor={(item) => item._id.toString()}
        contentContainerStyle={{ paddingBottom: 10 }}
      />
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
  dateSeparator: {
    alignItems: "center",
    marginVertical: 10,
  },
  dateText: {
    backgroundColor: "#e0e0e0",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    color: "#555",
    fontSize: 14,
  },
  messageContainer: {
    flexDirection: "row",
    marginBottom: 15,
    alignItems: "flex-start",
  },
  currentUserMessage: {
    justifyContent: "flex-end",
    flexDirection: "row",
  },
  receiverMessage: {
    justifyContent: "flex-start",
    flexDirection: "row",
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginHorizontal: 8,
  },
  messageBubble: {
    backgroundColor: "#f1f1f1",
    padding: 10,
    borderRadius: 15,
    maxWidth: "75%",
  },
  currentUserBubble: {
    backgroundColor: "#0078d4",
  },
  messageText: {
    color: "#000",
    fontSize: 16,
  },
  timestamp: {
    fontSize: 12,
    color: "#888",
    marginTop: 5,
    alignSelf: "flex-end",
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
