import React, { useContext } from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { users } from "../backend"; // Import the users array

function ProfileScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { userId } = route.params; // Get userId from route parameters

  // Find the user by ID
  const user = users.find((u) => u.id === userId);

  if (!user) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>User not found</Text>
      </View>
    );
  }

  // Function to handle chatting with the user
  const handleChat = () => {
    navigation.navigate("ChatScreen", {
      receiverId: user.id,
    });
  };

  // Function to handle deleting the user
  const handleDelete = () => {
    Alert.alert(
      "Delete User",
      `Are you sure you want to delete ${user.username}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            Alert.alert("User Deleted", `${user.username} has been deleted.`);
            navigation.goBack(); // Navigate back after deletion
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: user.profilePhoto }} style={styles.profileImage} />
      <Text style={styles.name}>{user.username}</Text>
      <Text style={styles.bio}>{user.bio || "No bio available"}</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.chatButton} onPress={handleChat}>
          <Text style={styles.buttonText}>Chat with {user.username}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Text style={styles.buttonText}>Delete User</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "#0078d4",
  },
  name: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  bio: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  buttonContainer: {
    width: "100%",
    marginTop: 20,
  },
  chatButton: {
    backgroundColor: "#0078d4",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: "center",
  },
  deleteButton: {
    backgroundColor: "#d9534f",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
  },
  errorText: {
    fontSize: 20,
    color: "#d9534f",
    fontWeight: "bold",
  },
});

export default ProfileScreen;
