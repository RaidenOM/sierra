import React, { useContext } from "react";
import { View, Text, Image, StyleSheet, Button } from "react-native";
import { UserContext } from "../store/user-context"; // Import the UserContext

export default function UserProfileScreen({ navigation }) {
  const { user } = useContext(UserContext); // Access user data from the context

  // Check if user data is available
  if (!user) {
    return <Text>Loading...</Text>; // Show loading until user data is fetched
  }

  return (
    <View style={styles.container}>
      <Image source={{ uri: user.profilePhoto }} style={styles.profileImage} />
      <Text style={styles.username}>{user.username}</Text>
      <Text style={styles.bio}>{user.bio}</Text>
      <Button
        title="Edit Profile"
        onPress={() => navigation.navigate("EditProfileScreen")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  username: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  bio: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
});
