import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const AddContactScreen = ({ navigation }) => {
  const [username, setUsername] = useState(""); // To hold the input username
  const [isLoading, setIsLoading] = useState(false); // For loading state

  // Function to handle search for user and save contact
  const handleSearchAndSaveContact = async () => {
    if (!username.trim()) {
      Alert.alert("Error", "Please enter a username.");
      return;
    }

    setIsLoading(true); // Set loading state

    try {
      // Send request to check if user exists
      const response = await axios.get(
        `http://192.168.31.6:3000/search/${username}`
      );

      if (response.data) {
        // User found, now save to AsyncStorage
        const contact = {
          id: response.data._id,
        };

        let contacts = await AsyncStorage.getItem("contacts");
        contacts = contacts ? JSON.parse(contacts) : [];

        // Add new contact to existing contacts
        contacts.push(contact);

        await AsyncStorage.setItem("contacts", JSON.stringify(contacts));
        console.log(contacts);
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
      <Text style={styles.title}>Add Contact</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter username"
        value={username}
        onChangeText={setUsername}
      />
      <Button
        title={isLoading ? "Searching..." : "Search and Add Contact"}
        onPress={handleSearchAndSaveContact}
        disabled={isLoading} // Disable button while loading
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
});

export default AddContactScreen;
