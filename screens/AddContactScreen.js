import React, { useContext, useState } from "react";
import { View, Text, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { UserContext } from "../store/user-context";
import CustomButton from "../components/CustomButton";
import CustomInput from "../components/CustomInput";
import { normalizePhoneNumber } from "../utils/UtilityFunctions";

const AddContactScreen = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState(""); // Added phone number state
  const [isLoading, setIsLoading] = useState(false);
  const { addContact, user } = useContext(UserContext);

  const handleSaveContact = async () => {
    const trimmedUsername = username.trim();
    const trimmedPhoneNumber = phoneNumber.trim(); // Trim the phone number input

    // Check for empty inputs
    if (!trimmedUsername || !trimmedPhoneNumber) {
      Alert.alert("Error", "Please enter both username and phone number.");
      return;
    }

    if (user.username === trimmedUsername) {
      Alert.alert("Error", "Cannot add current user to contact list.");
      return;
    }

    setIsLoading(true);
    const normalizePhoneNumber = normalizePhoneNumber(trimmedPhoneNumber);

    try {
      const contact = {
        name: trimmedUsername,
        phoneNumber: normalizePhoneNumber,
      };

      await addContact(contact.name, contact.phoneNumber);

      Alert.alert("Success", "Contact added successfully.");
      navigation.goBack();
    } catch (error) {
      console.error("Error adding contact:", error);
      Alert.alert("Error", "Failed to add contact.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.label}>Enter Username and Phone Number</Text>

        <CustomInput
          onChangeText={setUsername}
          placeholder="Username"
          value={username}
        />

        <CustomInput
          onChangeText={setPhoneNumber}
          placeholder="Phone Number"
          value={phoneNumber}
          keyboardType="phone-pad"
        />

        <CustomButton
          type="primary"
          style={[
            { backgroundColor: "#66e84d", marginTop: 10 },
            isLoading && { backgroundColor: "#a7fa96" },
          ]}
          onPress={handleSaveContact}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <>Add to Contacts</>
          )}
        </CustomButton>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#dfe5f7",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  label: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 10,
    textAlign: "center",
    marginBottom: 60,
  },
});

export default AddContactScreen;
