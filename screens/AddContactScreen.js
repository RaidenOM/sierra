import React, { useContext, useState } from "react";
import { View, Text, StyleSheet, Alert, ActivityIndicator } from "react-native";
import axios from "axios";
import { UserContext } from "../store/user-context";
import CustomButton from "../components/CustomButton";
import CustomInput from "../components/CustomInput";

const AddContactScreen = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { addContact } = useContext(UserContext);

  const handleSearchAndSaveContact = async () => {
    const trimmedUsername = username.trim();
    if (!trimmedUsername) {
      Alert.alert("Error", "Please enter a username.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.get(
        `https://sierra-backend.onrender.com/search/${trimmedUsername}`
      );

      if (response.data) {
        const contact = {
          id: response.data._id,
        };

        await addContact(contact);
        Alert.alert("Success", "Contact added successfully.");
        navigation.goBack();
      }
    } catch (error) {
      console.error("Error searching for user:", error);
      Alert.alert("Error", "User not found.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.label}>Enter Username</Text>
        <CustomInput
          onChangeText={setUsername}
          placeholder={"Username"}
          value={username}
        />

        <CustomButton
          type="primary"
          style={[
            { backgroundColor: "#66e84d", marginTop: 10 },
            isLoading && { backgroundColor: "#a7fa96" },
          ]}
          onPress={handleSearchAndSaveContact}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <>Search & Add</>
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
    fontSize: 32,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 10,
    textAlign: "center",
    marginBottom: 60,
  },
});

export default AddContactScreen;
