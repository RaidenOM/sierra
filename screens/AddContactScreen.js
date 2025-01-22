import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import { UserContext } from "../store/user-context";

const AddContactScreen = ({ navigation }) => {
  const [username, setUsername] = useState(""); // To hold the input username
  const [isLoading, setIsLoading] = useState(false); // For loading state
  const { addContact } = useContext(UserContext);

  // Function to handle search for user and save contact
  const handleSearchAndSaveContact = async () => {
    const trimmedUsername = username.trim();
    if (!trimmedUsername) {
      Alert.alert("Error", "Please enter a username.");
      return;
    }

    setIsLoading(true); // Set loading state

    try {
      // Send request to check if user exists
      const response = await axios.get(
        `https://sierra-backend.onrender.com/search/${trimmedUsername}`
      );

      if (response.data) {
        // User found, now save to AsyncStorage
        const contact = {
          id: response.data._id,
        };

        await addContact(contact);
        Alert.alert("Success", "Contact added successfully.");
        navigation.goBack(); // Go back to previous screen
      }
    } catch (error) {
      console.error("Error searching for user:", error);
      Alert.alert("Error", "User not found.");
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.label}>Enter Username</Text>
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
        />
        <TouchableOpacity
          style={[
            styles.button,
            isLoading && { backgroundColor: "#b0c4de" }, // Lighter color when disabled
          ]}
          onPress={handleSearchAndSaveContact}
          disabled={isLoading} // Disable button while loading
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Search & Add</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fb",
  },
  header: {
    backgroundColor: "#2575fc",
    paddingVertical: 20,
    alignItems: "center",
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  headerText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    backgroundColor: "#fff",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#2575fc",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default AddContactScreen;
