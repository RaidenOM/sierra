import React, { useContext } from "react";
import { TextInput, StyleSheet } from "react-native";
import { UserContext } from "../store/app-context";

export default function CustomInput({
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  keyboardType,
  autoCapitalize,
  multiline,
  style,
  onContentSizeChange,
}) {
  const { theme } = useContext(UserContext);

  const isDarkTheme = theme === "dark";

  return (
    <TextInput
      style={[
        styles.input,
        {
          backgroundColor: isDarkTheme ? "rgb(30,30,30)" : "white",
          color: isDarkTheme ? "white" : "black",
        },
        style,
      ]}
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      keyboardType={keyboardType || ""}
      secureTextEntry={secureTextEntry}
      placeholderTextColor="#7f8c8d"
      autoCapitalize={autoCapitalize}
      multiline={multiline}
      onContentSizeChange={onContentSizeChange}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: "#D3D3D3",
    borderRadius: 15,
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "#fff",
    fontSize: 16,
  },
});
