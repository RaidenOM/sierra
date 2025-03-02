import React, { useContext } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { UserContext } from "../store/app-context";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";

export default function UserProfileScreen({ navigation }) {
  const { user, logout, theme } = useContext(UserContext);
  const isDarkTheme = theme === "dark";

  function renderContent() {
    return (
      <>
        <View
          style={[
            styles.card,
            { backgroundColor: isDarkTheme ? "rgb(30,30,30)" : "white" },
          ]}
        >
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("ViewImageScreen", {
                mediaURL: user.profilePhoto,
                username: user.username,
              });
            }}
          >
            <Image
              source={
                user.profilePhoto
                  ? { uri: user.profilePhoto }
                  : require("../assets/image/user.png")
              }
              style={styles.profileImage}
            />
          </TouchableOpacity>
          <Text
            style={[styles.name, { color: isDarkTheme ? "#EAEAEA" : "#333" }]}
          >
            {user.username}
          </Text>
          <Text style={styles.bio}>{user.bio}</Text>
          <Text style={styles.phoneNumber}>{user.phone}</Text>
          <View style={styles.iconContainer}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => navigation.navigate("EditProfileScreen")}
            >
              <Ionicons name="create-outline" size={28} color="#ff9800" />
              <Text
                style={[styles.iconLabel, { color: isDarkTheme && "white" }]}
              >
                Edit
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.iconButton} onPress={logout}>
              <Ionicons name="log-out-outline" size={28} color="#e74c3c" />
              <Text
                style={[styles.iconLabel, { color: isDarkTheme && "white" }]}
              >
                Logout
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </>
    );
  }

  return (
    <>
      {isDarkTheme ? (
        <View style={[styles.container, { backgroundColor: "black" }]}>
          {renderContent()}
        </View>
      ) : (
        <LinearGradient
          style={styles.container}
          colors={[
            "rgb(215, 236, 250)",
            "rgb(239, 239, 255)",
            "rgb(255, 235, 253)",
          ]}
        >
          {renderContent()}
        </LinearGradient>
      )}
    </>
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
  },
  name: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 10,
  },
  bio: {
    fontSize: 16,
    color: "#7f8c8d",
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
    color: "#7f8c8d",
    marginBottom: 15,
  },
});
