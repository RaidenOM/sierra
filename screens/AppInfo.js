import { useContext } from "react";
import { UserContext } from "../store/app-context";
import { Image, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function AppInfo() {
  const { theme } = useContext(UserContext);
  const isDarkTheme = theme === "dark";

  function renderContent() {
    return (
      <>
        <View style={styles.logoContainer}>
          <Image
            source={require("../assets/sierra.png")}
            style={{ height: 100, width: 100 }}
            resizeMode="contain"
          />
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.textCenter, styles.logoText]}>Sierra</Text>
          <Text
            style={[
              styles.textCenter,
              { color: isDarkTheme ? "#EAEAEA" : "#333" },
            ]}
          >
            A cross platform real time multimedia chat application integrated
            with FCM and custom backend
          </Text>
          <View style={styles.lightTextContainer}>
            <Text style={[styles.textCenter, { color: "#7f8c8d" }]}>
              Made by Om Kumar
            </Text>
            <Text style={[styles.textCenter, { color: "#7f8c8d" }]}>
              ©2025-26
            </Text>
          </View>
        </View>
      </>
    );
  }

  return (
    <>
      {isDarkTheme ? (
        <View style={[styles.container, { backgroundColor: "black" }]}>
          {renderContent()}
        </View>
      ) : (
        <LinearGradient
          style={styles.container}
          colors={[
            "rgba(215, 236, 250, 1)",
            "rgba(239, 239, 255, 1)",
            "rgba(255, 235, 253, 1)",
          ]}
        >
          {renderContent()}
        </LinearGradient>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  textContainer: {
    paddingHorizontal: 50,
    width: "100%",
  },
  textCenter: {
    textAlign: "center",
  },
  logoText: {
    fontFamily: "Orbitron_400Regular",
    fontSize: 32,
    color: "#6993ff",
    paddingVertical: 25,
  },
  lightTextContainer: {
    marginTop: 12.5,
  },
});
