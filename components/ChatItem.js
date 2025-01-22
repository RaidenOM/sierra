import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

const ChatItem = ({
  profilePhoto,
  name,
  recentMessage,
  onPress,
  isSent,
  unreadCount,
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
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginVertical: 5,
    borderRadius: 10, // Same as ContactItem
    backgroundColor: "#f9f9f9", // Similar to ContactItem's background color
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
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
    fontSize: 18, // Similar to ContactItem's name size
    fontWeight: "bold",
    color: "#333",
  },
  messageContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6, // Space between the name and message
  },
  icon: {
    marginRight: 4,
  },
  recentMessage: {
    fontSize: 14,
    color: "#777",
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
    fontWeight: 800,
  },
});

export default ChatItem;
