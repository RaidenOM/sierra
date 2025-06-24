import {
  Alert,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useContext } from "react";
import { UserContext } from "../store/app-context";
import { LinearGradient } from "expo-linear-gradient";

export default function SettingsScreen() {
  const { theme, toggleTheme, logout, profileDeleteHandler } =
    useContext(UserContext);
  const isDarkTheme = theme === "dark";

  function renderContent() {
    return (
      <>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => {
            navigation.navigate("AppInfo");
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons
              name="information-circle-outline"
              color={isDarkTheme ? "white" : "black"}
              size={20}
            />
            <Text
              style={{ color: isDarkTheme ? "white" : "black", marginLeft: 10 }}
            >
              App Info
            </Text>
          </View>
          <Ionicons
            name="chevron-forward"
            color={isDarkTheme ? "white" : "black"}
          />
        </TouchableOpacity>
        <View style={styles.menuItem}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons
              name={isDarkTheme ? "moon" : "sunny"}
              color={isDarkTheme ? "white" : "black"}
              size={20}
            />
            <Text
              style={{ color: isDarkTheme ? "white" : "black", marginLeft: 10 }}
            >
              Dark Mode
            </Text>
          </View>
          <Switch
            value={isDarkTheme}
            onValueChange={toggleTheme}
            thumbColor={"#6993ff"}
            trackColor={{ false: "#ccc", true: "#333" }}
          />
        </View>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => {
            navigation.navigate("UserProfileScreen");
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons
              name="person-circle"
              color={isDarkTheme ? "white" : "black"}
              size={20}
            />
            <Text
              style={{ color: isDarkTheme ? "white" : "black", marginLeft: 10 }}
            >
              Profile Details
            </Text>
          </View>
          <Ionicons
            name="chevron-forward"
            color={isDarkTheme ? "white" : "black"}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => {
            Alert.alert("Confirm Logout", "Are you sure you want to logout?", [
              { text: "Cancel", style: "cancel" },
              {
                text: "Logout",
                onPress: async () => {
                  await logout();
                },
                style: "destructive",
              },
            ]);
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons
              name="log-out-outline"
              color={isDarkTheme ? "white" : "black"}
              size={20}
            />
            <Text
              style={{ color: isDarkTheme ? "white" : "black", marginLeft: 10 }}
            >
              Logout
            </Text>
          </View>
          <Ionicons
            name="chevron-forward"
            color={isDarkTheme ? "white" : "black"}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={profileDeleteHandler}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons name="trash-bin" color="#de0007" size={20} />
            <Text style={{ color: "#de0007", marginLeft: 10 }}>
              Delete Profile
            </Text>
          </View>
          <Ionicons
            name="chevron-forward"
            color={isDarkTheme ? "white" : "black"}
          />
        </TouchableOpacity>
      </>
    );
  }

  const navigation = useNavigation();
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
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 20,
    height: 60,
  },
});
