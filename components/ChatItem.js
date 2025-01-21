import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

const ChatItem = ({
  profilePhoto,
  name,
  recentMessage,
  onPress,
  isSent,
  isRead,
}) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image source={{ uri: profilePhoto }} style={styles.profilePhoto} />
      <View style={styles.textContainer}>
        <Text style={styles.name} numberOfLines={1}>
          {name}
        </Text>
        <View style={styles.messageContainer}>
          <Ionicons
            name={isSent ? "arrow-back" : "arrow-forward"}
            size={16}
            color="#888"
            style={styles.icon}
          />
          <Text style={styles.recentMessage} numberOfLines={1}>
            {recentMessage}
          </Text>
        </View>
        {/* Add green marker if message is not read */}
        {!isRead && <View style={styles.unreadMarker} />}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginVertical: 5,
    borderRadius: 12,
    backgroundColor: "#fff",
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  profilePhoto: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
  },
  name: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#333",
  },
  messageContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  icon: {
    marginRight: 8,
  },
  recentMessage: {
    fontSize: 14,
    color: "#666",
  },
  unreadMarker: {
    position: "absolute",
    top: 10,
    right: 15,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "green", // Green marker for unread message
  },
});

export default ChatItem;
