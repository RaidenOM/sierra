import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  Alert,
  TouchableOpacity,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ActivityIndicator } from "react-native";
import * as Contacts from "expo-contacts";
import { normalizePhoneNumber } from "../utils/UtilityFunctions";

function ProfileScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const [loading, setLoading] = useState(true);
  const { id, handleContactDelete } = route.params;

  const [user, setUser] = useState(null);
  const [contactName, setContactName] = useState(null);

  // Fetch user details from server
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `https://sierra-backend.onrender.com/users/${id}`
        );
        setUser(response.data);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  // fetch contact name from device
  useEffect(() => {
    const fetchContactName = async () => {
      const contactName = await getContactFromNumber(user.phone);
      setContactName(contactName);
    };

    if (user) fetchContactName();
  }, [user]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={styles.loadingText}>Loading Details...</Text>
      </View>
    );
  }

  if (!loading && !user) {
    Alert.alert("User not found", "The specified user cannot be found.", [
      {
        text: "OK",
        style: "default",
        onPress: () => {
          navigation.goBack();
        },
      },
    ]);
    return;
  }

  const handleChat = () => {
    navigation.navigate("ChatScreen", {
      receiverId: user._id,
    });
  };

  // function to find contact from phone number
  async function getContactFromNumber(phoneNumber) {
    try {
      const { status } = await Contacts.getPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission denied",
          "Cannot access contacts without permission."
        );
        return;
      }

      const { data } = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.PhoneNumbers, Contacts.Fields.Name],
      });

      const contact = data.find((contact) =>
        contact.phoneNumbers?.some((phone) => {
          return normalizePhoneNumber(phone.number) === phoneNumber;
        })
      );

      console.log(contact);

      if (contact) {
        return contact.name;
      } else {
        return null;
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Error fetching contact details");
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Image
          source={{ uri: user.profilePhoto }}
          style={styles.profileImage}
        />
        <Text style={styles.name}>{user.username}</Text>
        <Text style={styles.bio}>{user.bio}</Text>
        <Text style={styles.phoneNumber}>{user.phone}</Text>
        <Text style={styles.contactName}>Saved Contact: {contactName}</Text>
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
