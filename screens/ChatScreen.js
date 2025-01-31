import { useContext, useState, useEffect, useLayoutEffect } from "react";
import {
  Text,
  View,
  FlatList,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ImageBackground,
} from "react-native";
import {
  useIsFocused,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import axios from "axios";
import { UserContext } from "../store/user-context";
import { useRef } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { format } from "date-fns";

function ChatScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { user, socket, token } = useContext(UserContext);
  const { receiverId } = route.params;

  const [receiver, setReceiver] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const isFocused = useIsFocused();

  const flatListRef = useRef(null);

  // Fetch receiver information
  useEffect(() => {
    async function findReceiverInfo() {
      try {
        const response = await axios.get(
          `https://sierra-backend.onrender.com/users/${receiverId}`
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
          `https://sierra-backend.onrender.com/messages/${receiverId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
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
  }, [token, receiverId, receiver]);

  // bind handler to handler emits from server
  useEffect(() => {
    socket.on("new-message", (newMessage) => {
      if (newMessage.senderId === receiverId)
        setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    return () => {
      socket.off("new-message");
    };
  }, [socket]);

  // bind handler to handler emits from server
  useEffect(() => {
    socket.on("message-sent", (newMessage) => {
      if (newMessage.senderId === user._id)
        setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    return () => {
      socket.off("message-sent");
    };
  }, [socket]);

  // useEffect to mark messages as read between current user and other user on screen exit
  useEffect(() => {
    const markAsRead = async () => {
      console.log(receiverId);
      console.log(token);
      await axios.put(
        `https://sierra-backend.onrender.com/messages/mark-read/${receiverId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    };

    if (!isFocused) markAsRead();
  }, [isFocused, receiverId, token]);

  // Scroll to the bottom on mount and when new messages arrive
  useLayoutEffect(() => {
    if (!loading && messages.length > 0) {
      flatListRef.current?.scrollToEnd({ animated: true });
    }
  }, [messages, loading]);

  // useLayoutEffect to set the title for ChatScreen
  useLayoutEffect(() => {
    if (receiver)
      navigation.setOptions({
        headerTitle: () => (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("ProfileScreen", { id: receiverId });
            }}
            style={styles.headerTitle}
          >
            <Image
              source={{ uri: receiver.profilePhoto }}
              style={styles.headerProfileImage}
            />
            <Text style={styles.headerTitleUsername}>{receiver.username}</Text>
          </TouchableOpacity>
        ),
      });
    navigation.setOptions({
      headerRight: ({ tintColor }) => (
        <View style={styles.headerButtonContainer}>
          <TouchableOpacity
            onPress={async () => {
              await handleChatDelete(receiverId);
            }}
          >
            <Ionicons name="trash-outline" size={30} color="red" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [receiver]);

  // Sort messages based on sentAt field
  const sortedMessages = messages.sort((a, b) => {
    const dateA = new Date(a.sentAt);
    const dateB = new Date(b.sentAt);
    return dateA - dateB;
  });

  // Helper function to format dates
  const formatDate = (date) => {
    return format(new Date(date), "eee, MMMM dd, yyyy"); // Format as "Sun, January 26, 2025"
  };

  // Helper function to format time (e.g., "10:03 AM")
  const formatTime = (date) => {
    return format(new Date(date), "hh:mm a"); // Format as "10:03 AM"
  };

  async function handleChatDelete(otherUserId) {
    Alert.alert(
      "Delete Chats",
      "Are you sure you want to delete all chats with this user?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await axios.delete(
              `https://sierra-backend.onrender.com/messages/${otherUserId}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            Alert.alert("Chats Deleted", "All Chats have been erased.");
            navigation.goBack();
          },
        },
      ]
    );
  }

  const renderItem = ({ item, index }) => {
    const isCurrentUser = item.senderId === user._id;

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
            {item.senderId !== user._id && !item.isRead && (
              <View style={styles.unreadMarker} />
            )}
            <Text style={styles.timestamp}>{formatTime(item.sentAt)}</Text>
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
        socket.emit("send-message", message);
        setNewMessage(""); // Clear input after sending
      } catch (error) {
        console.error("Error sending message", error);
      }
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={styles.loadingText}>Loading Chats...</Text>
      </View>
    );
  }

  return (
    <ImageBackground
      style={styles.container}
      source={require("../assets/chat-background.png")}
      resizeMode="contain"
    >
      <FlatList
        ref={flatListRef}
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
          <Text style={styles.sendButtonText}>
            <Ionicons name="arrow-forward" />
          </Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#dfe5f7",
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
    overflow: "hidden",
    marginHorizontal: 8,
  },
  messageBubble: {
    backgroundColor: "#e1e1e3",
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
    color: "#333",
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#dfe5f7",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#555",
  },
  headerButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginRight: 10,
  },
  unreadMarker: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "green", // Green marker for unread message
  },
  headerTitle: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitleUsername: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 10,
  },
  headerProfileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: "hidden",
  },
});

export default ChatScreen;
