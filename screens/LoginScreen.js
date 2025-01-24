import React, { useContext, useState } from "react";
import { View, Text, StyleSheet, Image, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserContext } from "../store/user-context";
import CustomInput from "../components/CustomInput";
import CustomButton from "../components/CustomButton";
import axios from "axios";

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { setIsAuthenticating } = useContext(UserContext);

  const validateInputs = () => {
    if (!username.trim()) {
      Alert.alert("Validation Error", "Username is required.");
      return false;
    }
    if (username.includes(" ")) {
      Alert.alert("Validation Error", "Username cannot have spaces");
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

  const handleLogin = async () => {
    if (!validateInputs()) return;

    const trimmedUsername = username.trim();
    try {
      const response = await axios.post(
        `https://sierra-backend.onrender.com/login`,
        {
          username: trimmedUsername,
          password: password,
        }
      );

      const { token } = response.data;
      await AsyncStorage.setItem("token", token);
      setIsAuthenticating(true);
    } catch (error) {
      Alert.alert("Error", "An error occurred. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/sierra.png")}
        resizeMode="contain"
        style={styles.logo}
      />
      <Text style={styles.title}>Welcome Back</Text>
      <Text style={styles.subtitle}>Log in to your account</Text>
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
      <CustomButton onPress={handleLogin}>Login</CustomButton>
      <CustomButton
        onPress={() => navigation.navigate("RegisterScreen")}
        type="secondary"
      >
        New User? Register
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
  logo: {
    height: 120,
    width: 120,
    marginBottom: 30,
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
});
