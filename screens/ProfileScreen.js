import React from "react";
import { Text, View, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";

function ProfileScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { contact } = route.params;

  const handleChat = () => {
    navigation.navigate("ChatScreen", {
      receiverId: contact._id,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Image
          source={{ uri: contact.profilePhoto }}
          style={styles.profileImage}
        />
        <Text style={styles.name}>{contact.username}</Text>
        <Text style={styles.bio}>{contact.bio}</Text>
        <Text style={styles.phoneNumber}>{contact.phone}</Text>
        <Text style={styles.contactName}>
          Saved Contact: {contact.savedName}
        </Text>
        <View style={styles.iconContainer}>
          <TouchableOpacity style={styles.iconButton} onPress={handleChat}>
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={28}
              color="#4caf50"
            />
            <Text style={styles.iconLabel}>Chat</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#dfe5f7",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    width: "90%",
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
    borderWidth: 3,
    borderColor: "#2575fc",
  },
  name: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  bio: {
    fontSize: 16,
    color: "#555",
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
    backgroundColor: "#dfe5f7",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#555",
  },
  phoneNumber: {
    fontSize: 16,
    color: "#919090",
    marginBottom: 15,
  },
  contactName: {
    fontSize: 16,
    color: "#007bff",
    marginBottom: 15,
  },
});

export default ProfileScreen;
