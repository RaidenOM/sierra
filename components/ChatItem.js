import React, { useContext } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { UserContext } from "../store/user-context";

const ChatItem = ({
  profilePhoto,
  name,
  recentMessage,
  onPress,
  isSent,
  unreadCount,
  typing,
}) => {
  const { theme } = useContext(UserContext);
  const isDarkTheme = theme === "dark";
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image
        source={
          profilePhoto
            ? { uri: profilePhoto }
            : require("../assets/images/user.png")
        }
        style={styles.profilePhoto}
      />
      <View style={styles.textContainer}>
        <Text
          style={[styles.name, { color: isDarkTheme ? "#EAEAEA" : "#333" }]}
          numberOfLines={1}
        >
          {name}
        </Text>
        <View style={styles.messageContainer}>
          {typing ? (
            <Text style={{ color: "#00fa57" }}>typing...</Text>
          ) : (
            <>
              <Ionicons
                name={isSent ? "arrow-back" : "arrow-forward"}
                size={16}
                color="#888"
                style={styles.icon}
              />
              <Text style={styles.recentMessage} numberOfLines={1}>
                {recentMessage}
              </Text>
            </>
          )}
        </View>

        {unreadCount > 0 && (
          <View style={styles.unreadMarker}>
            <Text style={styles.unreadCount}>{unreadCount}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 15,
  },
  profilePhoto: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
  },
  messageContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  icon: {
    marginRight: 4,
  },
  recentMessage: {
    fontSize: 14,
    color: "#7f8c8d",
    paddingRight: 10,
  },
  unreadMarker: {
    position: "absolute",
    top: 2,
    right: 15,
    width: 25,
    height: 25,
    borderRadius: 12.5,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "green",
  },
  unreadCount: {
    color: "#fff",
  },
});

export default ChatItem;
