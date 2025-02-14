import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Platform,
} from "react-native";
import axios from "axios";
import CustomInput from "../components/CustomInput";
import CustomButton from "../components/CustomButton";
import { validatePhoneNumber } from "../utils/UtilityFunctions";
import { Picker } from "@react-native-picker/picker";
import countries from "../utils/CountryCodes";

export default function RegisterScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [registerLoading, setRegisterLoading] = useState(false);
  const [country, setCountry] = useState("+91");

  // Function to validate phone number and other inputs
  const validateInputs = () => {
    // Username validation
    if (!username.trim()) {
      Alert.alert("Validation Error", "Username is required.");
      return false;
    }
    if (username.includes(" ")) {
      Alert.alert("Validation Error", "Username cannot have spaces.");
      return false;
    }
    if (username.length < 3) {
      Alert.alert(
        "Validation Error",
        "Username must be at least 3 characters long."
      );
      return false;
    }

    // Phone number validation (e.g., +91 followed by 10 digits)
    if (!phone.trim()) {
      Alert.alert("Validation Error", "Phone number is required.");
      return false;
    }

    // Validate phone number with regex for proper format (+<country_code> followed by 10 digits)
    if (!validatePhoneNumber(phone)) {
      Alert.alert("Validation Error", "Invalid phone number");
      return false;
    }

    // Password validation
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
    if (password && confirmPassword && password !== confirmPassword) {
      Alert.alert("Validation Error", "Password must be same.");
      return false;
    }

    return true; // All validations passed
  };

  const handleRegister = async () => {
    // First validate inputs
    if (!validateInputs()) return;

    setRegisterLoading(true);
    const trimmedUsername = username.trim();
    const trimmedPhone = phone.trim();
    try {
      // Sending data to backend for registration
      const response = await axios.post(
        "https://sierra-backend.onrender.com/register",
        {
          username: trimmedUsername,
          phone: country + trimmedPhone,
          password,
        }
      );

      Alert.alert("Success", "Registration successful!");
      navigation.goBack();
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "An error occurred.";
      Alert.alert("Registration Error", errorMessage);
    } finally {
      setRegisterLoading(false);
    }
    console.log(country + phone);
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
        autoCapitalize="none"
      />
      <View style={styles.phoneContainer}>
        <Picker
          style={styles.picker}
          selectedValue={country}
          onValueChange={(value) => setCountry(value)}
          mode={Platform.OS === "ios" ? "dropdown" : "dialog"}
        >
          {countries.map((country) => (
            <Picker.Item
              label={country.label}
              value={country.code}
              key={country.code}
            />
          ))}
        </Picker>
        <CustomInput
          placeholder="Phone Number"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          style={styles.phoneInput}
        />
      </View>
      <CustomInput
        placeholder="Password"
        value={password}
        secureTextEntry
        onChangeText={setPassword}
        style={styles.input}
        autoCapitalize="none"
      />
      <CustomInput
        placeholder="Confirm password"
        value={confirmPassword}
        secureTextEntry
        onChangeText={setConfirmPassword}
        style={styles.input}
        autoCapitalize="none"
      />
      <CustomButton
        onPress={handleRegister}
        style={styles.registerButton}
        disabled={registerLoading}
      >
        {registerLoading ? <ActivityIndicator color="#fff" /> : "Register"}
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
    width: "100%",
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
  phoneContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 15,
  },
  picker: {
    flex: 1,
    height: 50,
    marginRight: 10,
  },
  phoneInput: {
    flex: 1,
  },
});
