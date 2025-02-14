import { useContext, useEffect, useState } from "react";
import { UserContext } from "../store/user-context";
import axios from "axios";
import { StyleSheet } from "react-native";
import { View, Text, FlatList, ActivityIndicator } from "react-native";
import ChatItem from "../components/ChatItem";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";

export default function AllChats() {
  const { socket, user, token, typingUsers } = useContext(UserContext);
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const isFocused = useIsFocused();

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

        const indexToBeUpdated = updatedChats.findIndex(
          (chat) =>
            chat.senderId._id === otherPersonId ||
            chat.receiverId._id === otherPersonId
        );

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
      return prevChats.map((chat) => ({
        ...chat,
        unreadCount: 0,
        isRead: true,
      }));
    });
    navigation.navigate("ChatScreen", { receiverId: otherPersonId });
  }

  return (
    <LinearGradient
      style={styles.container}
      colors={[
        "rgba(215, 236, 250, 1)",
        "rgba(239, 239, 255, 1)",
        "rgba(255, 235, 253, 1)",
      ]}
    >
      <Text style={styles.title}>Chats</Text>
      {loading ? (
        <View style={[styles.container, styles.loadingContainer]}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.loadingText}>Fetching Chats...</Text>
        </View>
      ) : (
        <>
          {chats.length > 0 ? (
            <FlatList
              data={profiles}
              keyExtractor={(item) => item._id.toString()}
              renderItem={({ item }) => {
                const recentMessage = getLatestMessage(item._id);
                return (
                  <ChatItem
                    name={item.username}
                    recentMessage={
                      recentMessage.message ||
                      (recentMessage.mediaType === "image" && (
                        <Ionicons name="image" />
                      )) ||
                      (recentMessage.mediaType === "video" && (
                        <Ionicons name="videocam" />
                      )) ||
                      (recentMessage.mediaType === "audio" && (
                        <Ionicons name="musical-notes" />
                      ))
                    }
                    profilePhoto={item.profilePhoto}
                    isSent={recentMessage.senderId._id === user._id}
                    unreadCount={recentMessage.unreadCount || 0}
                    onPress={() => handlePress(item._id)}
                    typing={!!typingUsers[item._id]}
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
        </>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    marginTop: 15,
    marginLeft: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#7f8c8d",
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
    color: "#7f8c8d",
  },
});
