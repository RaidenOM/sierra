import React, { useContext } from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { UserContext } from "../store/user-context";

export default function CustomButton({
  children,
  onPress,
  type = "primary",
  style,
  disabled,
}) {
  const { theme } = useContext(UserContext);

  const isDarkTheme = theme === "dark";

  return (
    <TouchableOpacity
      style={[
        styles.button,
        type === "secondary" && styles.secondaryButton,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text
        style={[
          styles.buttonText,
          type === "secondary" && styles.secondaryButtonText,
        ]}
      >
        {children}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: "100%",
    alignItems: "center",
    backgroundColor: "#6993ff",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 5,
    marginBottom: 15,
  },
  secondaryButton: {
    backgroundColor: "#ccc",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#95a5a6",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    textAlign: "center",
  },
  secondaryButtonText: {
    color: "#333",
    fontWeight: "600",
  },
});
