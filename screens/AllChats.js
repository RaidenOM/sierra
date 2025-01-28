import { useContext, useEffect, useState } from "react";
import { UserContext } from "../store/user-context";
import axios from "axios";
import { StyleSheet } from "react-native";
import { View, Text, FlatList } from "react-native";
import ChatItem from "../components/ChatItem";
import { ActivityIndicator } from "react-native";
import { useIsFocused, useNavigation } from "@react-navigation/native";

export default function AllChats() {
  const { socket, user, token } = useContext(UserContext);
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  // Get latest chats for current user
  useEffect(() => {
    const fetchChats = async () => {
      const response = await axios.get(
        "https://sierra-backend.onrender.com/latest-messages",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setChats(response.data);
      setLoading(false);
    };

    if (isFocused) fetchChats();
  }, [token, isFocused]);

  // handle emits from server
  useEffect(() => {
    if (!socket) return;

    socket.on("chat-notify", (message) => {
      console.log("Received chat-notify message:", message);
      setChats((prevChats) => {
        const updatedChats = [...prevChats];
        const otherPersonId =
          message.senderId._id === user._id
            ? message.receiverId._id
            : message.senderId._id;

        // Find the chat to update, if exists
        const indexToBeUpdated = updatedChats.findIndex(
          (chat) =>
            chat.senderId._id === otherPersonId ||
            chat.receiverId._id === otherPersonId
        );

        // If the chat exists, update it; otherwise, add the new message
        if (indexToBeUpdated >= 0) {
          updatedChats[indexToBeUpdated] = message;
        } else {
          updatedChats.unshift(message);
        }

        return updatedChats;
      });
    });

    return () => {
      socket.off("chat-notify");
    };
  }, [socket, user._id]);

  const profiles = chats.map((chat) =>
    chat.senderId._id === user._id ? chat.receiverId : chat.senderId
  );

  function getLatestMessage(id) {
    return chats.find(
      (chat) => chat.senderId._id === id || chat.receiverId._id === id
    );
  }

  async function handlePress(otherPersonId) {
    setChats((prevChats) => {
      let updatedChats = prevChats.map((chat) => {
        return { ...chat, unreadCount: 0, isRead: true };
      });
      return updatedChats;
    });
    navigation.navigate("ChatScreen", { receiverId: otherPersonId });
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Fetching Chats...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chats</Text>
      {chats.length > 0 ? (
        <FlatList
          data={profiles}
          keyExtractor={(item) => item._id.toString()}
          renderItem={({ item }) => {
            const recentMessage = getLatestMessage(item._id);
            return (
              <ChatItem
                name={item.username}
                recentMessage={recentMessage.message}
                profilePhoto={item.profilePhoto}
                isSent={recentMessage.senderId._id === user._id}
                unreadCount={recentMessage.unreadCount}
                onPress={() => handlePress(item._id)}
              />
            );
          }}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <View style={styles.noChatsContainer}>
          <Text style={styles.noChatsText}>No Chats Found</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#dfe5f7",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
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
  listContainer: {
    paddingBottom: 20,
  },
  noChatsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noChatsText: {
    fontSize: 16,
    color: "#777",
  },
});
