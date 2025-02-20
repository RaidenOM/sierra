import React, { useContext, useState } from "react";
import { View, Text, StyleSheet, Alert, ActivityIndicator } from "react-native";
import axios from "axios";
import CustomInput from "../components/CustomInput";
import CustomButton from "../components/CustomButton";
import { validatePhoneNumber } from "../utils/UtilityFunctions";
import { Dropdown } from "react-native-element-dropdown";
import countries from "../utils/CountryCodes";
import { UserContext } from "../store/app-context";

export default function RegisterScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [registerLoading, setRegisterLoading] = useState(false);
  const [country, setCountry] = useState("+91");
  const { theme } = useContext(UserContext);

  const isDarkTheme = theme === "dark";

  const validateInputs = () => {
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

    if (!phone.trim()) {
      Alert.alert("Validation Error", "Phone number is required.");
      return false;
    }

    if (!validatePhoneNumber(phone)) {
      Alert.alert("Validation Error", "Invalid phone number");
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
    if (password && confirmPassword && password !== confirmPassword) {
      Alert.alert("Validation Error", "Password must be same.");
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    if (!validateInputs()) return;

    setRegisterLoading(true);
    const trimmedUsername = username.trim();
    const trimmedPhone = phone.trim();
    try {
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
    <View
      style={[
        styles.container,
        { backgroundColor: isDarkTheme ? "black" : "white" },
      ]}
    >
      <Text
        style={[styles.title, { color: isDarkTheme ? "#d3c1af" : "#2c3e50" }]}
      >
        Create an Account
      </Text>
      <Text style={styles.subtitle}>Sign up to get started</Text>

      <CustomInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
        autoCapitalize="none"
      />
      <View style={styles.phoneContainer}>
        <Dropdown
          style={styles.dropdown}
          placeholderStyle={{ color: isDarkTheme ? "white" : "black" }}
          selectedTextStyle={{ color: isDarkTheme ? "white" : "black" }}
          containerStyle={{
            backgroundColor: isDarkTheme ? "rgb(30,30,30)" : "white",
          }}
          data={countries}
          search
          maxHeight={300}
          labelField="label"
          valueField="code"
          placeholder="Select country"
          searchPlaceholder="Search..."
          value={country}
          onChange={(item) => {
            setCountry(item.code);
          }}
          itemTextStyle={{ color: isDarkTheme ? "white" : "black" }}
          activeColor="#6993ff"
        />

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
        disabled={registerLoading}
        style={{ marginBottom: 15 }}
      >
        {registerLoading ? <ActivityIndicator color="#fff" /> : "Register"}
      </CustomButton>
      <CustomButton onPress={() => navigation.goBack()} type="secondary">
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
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
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
  phoneContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 15,
  },
  dropdown: {
    flex: 1,
    marginRight: 10,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  phoneInput: {
    flex: 1,
    marginBottom: 0,
  },
});
