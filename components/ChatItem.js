import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

const ChatItem = ({ profilePhoto, name, recentMessage, onPress, isSent }) => {
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
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ececec",
  },
  profilePhoto: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  messageContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  icon: {
    marginRight: 6,
  },
  recentMessage: {
    fontSize: 14,
    color: "#555",
  },
});

export default ChatItem;
