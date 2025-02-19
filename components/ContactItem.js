import React, { useContext } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { UserContext } from "../store/user-context";

const ContactItem = ({ profilePhoto, name, bio, onPress }) => {
  const { theme } = useContext(UserContext);
  const isDarkTheme = theme === "dark";
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image
        source={
          profilePhoto
            ? { uri: profilePhoto }
            : require("../assets/imgs/user.png")
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
  bio: {
    fontSize: 14,
    color: "#7f8c8d",
    marginTop: 3,
  },
});

export default ContactItem;
