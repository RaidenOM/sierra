import React, { useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import axios from "axios";
import CustomInput from "../components/CustomInput";
import CustomButton from "../components/CustomButton";

export default function RegisterScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const validateInputs = () => {
    if (!username.trim()) {
      Alert.alert("Validation Error", "Username is required.");
      return false;
    }
    if (username.length < 3) {
      Alert.alert(
        "Validation Error",
        "Username must be at least 3 characters long."
      );
      return false;
    }
    if (!password) {
      Alert.alert("Validation Error", "Password is required.");
      return false;
    }
    if (password.length < 6) {
      Alert.alert(
        "Validation Error",
        "Password must be at least 6 characters long."
      );
      return false;
    }
    return true;
  };

  const handleRegister = async () => {
    if (!validateInputs()) return;

    const trimmedUsername = username.trim();
    try {
      const response = await axios.post(
        "https://sierra-backend.onrender.com/register",
        {
          username: trimmedUsername,
          password,
        }
      );

      Alert.alert("Success", "Registration successful!");
      navigation.navigate("LoginScreen");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "An error occurred.";
      Alert.alert("Registration Error", errorMessage);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create an Account</Text>
      <Text style={styles.subtitle}>Sign up to get started</Text>
      <CustomInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
      />
      <CustomInput
        placeholder="Password"
        value={password}
        secureTextEntry
        onChangeText={setPassword}
        style={styles.input}
      />
      <CustomButton onPress={handleRegister} style={styles.registerButton}>
        Register
      </CustomButton>
      <CustomButton
        onPress={() => navigation.goBack()}
        type="secondary"
        style={styles.loginButton}
      >
        Already have an account? Login
      </CustomButton>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    color: "#7f8c8d",
    marginBottom: 25,
    textAlign: "center",
  },
  input: {
    marginBottom: 15,
  },
  registerButton: {
    backgroundColor: "#6993ff",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 5,
    marginBottom: 15,
  },
  loginButton: {
    backgroundColor: "#ecf0f1",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#95a5a6",
  },
});
