import React from "react";
import { TextInput, StyleSheet } from "react-native";

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
  return (
    <TextInput
      style={[styles.input, style]}
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      keyboardType={keyboardType || ""}
      secureTextEntry={secureTextEntry}
      placeholderTextColor="#aaa"
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
