import React, { useContext } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { UserContext } from "../store/user-context";
import { LinearGradient } from "expo-linear-gradient";

export default function UserProfileScreen({ navigation }) {
  const { user, logout, loading } = useContext(UserContext);

  // Check if user data is available
  if (loading) {
    return (
      <LinearGradient
        style={styles.loadingContainer}
        colors={[
          "rgb(215, 236, 250)",
          "rgb(239, 239, 255)",
          "rgb(255, 235, 253)",
        ]}
      >
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Loading Details...</Text>
      </LinearGradient>
    );
  }

  console.log(user);

  return (
    <LinearGradient
      style={styles.container}
      colors={[
        "rgb(215, 236, 250)",
        "rgb(239, 239, 255)",
        "rgb(255, 235, 253)",
      ]}
    >
      <View style={styles.card}>
        <Image
          source={{ uri: user.profilePhoto }}
          style={styles.profileImage}
        />
        <Text style={styles.name}>{user.username}</Text>
        <Text style={styles.bio}>{user.bio}</Text>
        <Text style={styles.phoneNumber}>{user.phone}</Text>
        <View style={styles.iconContainer}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.navigate("EditProfileScreen")}
          >
            <Ionicons name="create-outline" size={28} color="#ff9800" />
            <Text style={styles.iconLabel}>Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconButton} onPress={logout}>
            <Ionicons name="log-out-outline" size={28} color="#e74c3c" />
            <Text style={styles.iconLabel}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
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
    backgroundColor: "white",
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
    borderWidth: 3,
    borderColor: "#6993ff",
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
    color: "#919090",
    marginBottom: 15,
  },
});
