import { useContext, useEffect, useState } from "react";
import { UserContext } from "../store/app-context";
import axios from "axios";
import { Alert, StyleSheet } from "react-native";
import { View, Text, FlatList, ActivityIndicator } from "react-native";
import ChatItem from "../components/ChatItem";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import { ChatContext } from "../store/chat-context";

export default function AllChats() {
  const {
    socket,
    user,
    token,
    typingUsers,
    playMessageReceivedSound,
    theme,
    appState,
  } = useContext(UserContext);
  const { chats, setChats } = useContext(ChatContext);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const isDarkTheme = theme === "dark";

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
  }, [token, isFocused, appState]);

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = async (message) => {
      console.log("Received chat-notify message:", message);

      if (appState === "active") await playMessageReceivedSound();
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
          updatedChats.splice(indexToBeUpdated, 1);
        }
        updatedChats.unshift(message);

        return updatedChats;
      });
    };

    socket.on("new-message", handleNewMessage);

    return () => {
      socket.off("new-message", handleNewMessage);
    };
  }, [socket, user._id, isFocused, appState]);

  useEffect(() => {
    const handleDeleteChat = ({ receiverId }) => {
      setChats((prevChats) =>
        prevChats.filter(
          (chat) =>
            chat.senderId._id !== receiverId &&
            chat.receiverId._id !== receiverId
        )
      );
      Alert.alert("Chats Deleted", "The other user deleted the chats");
      if (navigation.canGoBack()) navigation.goBack();
    };

    socket.on("delete-chat", handleDeleteChat);

    return () => {
      socket.off("delete-chat", handleDeleteChat);
    };
  }, [socket]);

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
      const updatedChats = [...prevChats];
      const indexToBeUpdated = updatedChats.findIndex(
        (chat) =>
          chat.senderId._id === otherPersonId ||
          chat.receiverId._id === otherPersonId
      );
      updatedChats[indexToBeUpdated] = {
        ...updatedChats[indexToBeUpdated],
        unreadCount: 0,
        isRead: true,
      };
      return updatedChats;
    });
    navigation.navigate("ChatScreen", {
      receiverId: otherPersonId,
    });
  }

  function renderChatList() {
    return (
      <>
        <Text
          style={[styles.title, { color: isDarkTheme ? "#EAEAEA" : "#333" }]}
        >
          Chats
        </Text>
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
      </>
    );
  }

  return (
    <>
      {isDarkTheme ? (
        <View style={[styles.container, { backgroundColor: "black" }]}>
          {renderChatList()}
        </View>
      ) : (
        <LinearGradient
          style={styles.container}
          colors={[
            "rgba(215, 236, 250, 1)",
            "rgba(239, 239, 255, 1)",
            "rgba(255, 235, 253, 1)",
          ]}
        >
          {renderChatList()}
        </LinearGradient>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
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
