import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";

const ContactItem = ({ profilePhoto, name, bio, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image source={{ uri: profilePhoto }} style={styles.profilePhoto} />
      <View style={styles.textContainer}>
        <Text style={styles.name} numberOfLines={1}>
          {name}
        </Text>
        <Text style={styles.bio} numberOfLines={1}>
          {bio}
        </Text>
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
    borderBottomColor: "#ccc",
  },
  profilePhoto: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  bio: {
    fontSize: 14,
    color: "#555",
    marginTop: 2,
  },
});

export default ContactItem;
