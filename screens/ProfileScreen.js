import React, { useContext } from "react";
import { Text, View, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useState, useEffect } from "react";
import axios from "axios";
import { ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { UserContext } from "../store/app-context";
import { ChatContext } from "../store/chat-context";

function ProfileScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { id } = route.params;
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { theme } = useContext(UserContext);
  const { setChats } = useContext(ChatContext);

  const isDarkTheme = theme === "dark";

  const handleChat = () => {
    setChats((prevChats) => {
      return prevChats.map((chat) =>
        chat.senderId._id === id
          ? { ...chat, isRead: true, unreadCount: 0 }
          : chat
      );
    });
    navigation.navigate("ChatScreen", {
      receiverId: id,
    });
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `https://sierra-backend.onrender.com/users/${id}`
        );
        setUser(response.data);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [id]);

  function renderContent() {
    return (
      <>
        {loading ? (
          <>
            <ActivityIndicator size="large" color="#4CAF50" />
            <Text style={styles.loadingText}>Loading Details...</Text>
          </>
        ) : (
          <View
            style={[
              styles.card,
              { backgroundColor: isDarkTheme ? "rgb(30,30,30)" : "white" },
            ]}
          >
            <TouchableOpacity
              onPress={() => {
                console.log(user.profilePhoto);
                navigation.navigate("ViewImageScreen", {
                  mediaURL: user.profilePhoto,
                  username: user.username,
                });
              }}
            >
              <Image
                source={
                  user.profilePhoto
                    ? { uri: user.profilePhoto }
                    : require("../assets/image/user.png")
                }
                style={styles.profileImage}
              />
            </TouchableOpacity>
            <Text
              style={[styles.name, { color: isDarkTheme ? "#EAEAEA" : "#333" }]}
            >
              {user.username}
            </Text>
            <Text style={styles.bio}>{user.bio}</Text>
            <Text style={styles.phoneNumber}>{user.phone}</Text>
            <View style={styles.iconContainer}>
              <TouchableOpacity style={styles.iconButton} onPress={handleChat}>
                <Ionicons
                  name="chatbubble-ellipses-outline"
                  size={28}
                  color="#4caf50"
                />
                <Text
                  style={[styles.iconLabel, { color: isDarkTheme && "white" }]}
                >
                  Chat
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </>
    );
  }

  return (
    <>
      {isDarkTheme ? (
        <View style={[styles.container, { backgroundColor: "black" }]}>
          {renderContent()}
        </View>
      ) : (
        <LinearGradient
          style={styles.container}
          colors={[
            "rgb(215, 236, 250)",
            "rgb(239, 239, 255)",
            "rgb(255, 235, 253)",
          ]}
        >
          {renderContent()}
        </LinearGradient>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
    width: "90%",
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
  },
  name: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 10,
  },
  bio: {
    fontSize: 16,
    color: "#7f8c8d",
    textAlign: "center",
    marginBottom: 15,
  },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "60%",
    marginTop: 20,
  },
  iconButton: {
    alignItems: "center",
  },
  iconLabel: {
    marginTop: 5,
    fontSize: 14,
    textAlign: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f2dede",
  },
  errorText: {
    fontSize: 20,
    color: "#a94442",
    fontWeight: "bold",
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
  phoneNumber: {
    fontSize: 16,
    color: "#7f8c8d",
    marginBottom: 15,
  },
});

export default ProfileScreen;
