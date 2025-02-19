import React, { useContext } from "react";
import { TextInput, StyleSheet } from "react-native";
import { UserContext } from "../store/user-context";

export default function CustomInput({
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  keyboardType,
  autoCapitalize,
  multiline,
  style,
}) {
  const { theme } = useContext(UserContext);

  const isDarkTheme = theme === "dark";

  return (
    <TextInput
      style={[
        styles.input,
        style,
        {
          backgroundColor: isDarkTheme ? "rgb(30,30,30)" : "white",
          color: isDarkTheme ? "white" : "black",
        },
      ]}
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      keyboardType={keyboardType || ""}
      secureTextEntry={secureTextEntry}
      placeholderTextColor="#7f8c8d"
      autoCapitalize={autoCapitalize}
      multiline={multiline}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    marginBottom: 15,
    borderRadius: 8,
    backgroundColor: "#fff",
  },
});
