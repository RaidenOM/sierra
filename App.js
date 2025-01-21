import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AllContacts from "./screens/AllContacts";
import ChatScreen from "./screens/ChatScreen";
import ProfileScreen from "./screens/ProfileScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import { AppContextProvider } from "./store/app-context";
import { Button, StyleSheet, View, TouchableOpacity } from "react-native";
import { UserContext, UserProvider } from "./store/user-context";
import { Text } from "react-native";
import UserProfileScreen from "./screens/UserProfileScreen";
import AddContactScreen from "./screens/AddContactScreen";
import { ActivityIndicator } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

// Create navigators
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function HomeTab() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#fff",
        tabBarInactiveTintColor: "#f0f4f8",
        tabBarStyle: {
          backgroundColor: "#3498db",
          borderTopLeftRadius: 15,
          borderTopRightRadius: 15,
        },
      }}
    >
      <Tab.Screen
        component={AllContacts}
        name="AllContacts"
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="people-outline" size={30} color={color} />
          ),
          tabBarLabel: "All Contacts",
        }}
      />
    </Tab.Navigator>
  );
}

function Navigation() {
  const { user, loading } = useContext(UserContext);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      {!user ? <AuthStack /> : <MainAppStack />}
    </NavigationContainer>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen
        component={LoginScreen}
        name="LoginScreen"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        component={RegisterScreen}
        name="RegisterScreen"
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

function MainAppStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: "#9b59b6",
          shadowOpacity: 0.3,
        },
        animation: "slide_from_right",
        headerTintColor: "white",
      }}
    >
      <Stack.Screen
        name="HomeTab"
        component={HomeTab}
        options={({ navigation }) => ({
          title: "Sierra",
          headerRight: ({ tintColor }) => (
            <View style={styles.headerButtonContainer}>
              <TouchableOpacity
                style={styles.headerButton}
                onPress={() => {
                  navigation.navigate("UserProfileScreen");
                }}
              >
                <Ionicons
                  name="person-circle-outline"
                  size={30}
                  color="#ffcc00"
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.headerButton}
                onPress={() => {
                  navigation.navigate("AddContactScreen");
                }}
              >
                <Ionicons name="person-add-outline" size={30} color="#2ecc71" />
              </TouchableOpacity>
            </View>
          ),
        })}
      />
      <Stack.Screen name="ChatScreen" component={ChatScreen} />
      <Stack.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{ headerTitle: "Profile" }}
      />
      <Stack.Screen
        name="UserProfileScreen"
        component={UserProfileScreen}
        options={{ headerTitle: "User Details" }}
      />
      <Stack.Screen
        name="AddContactScreen"
        component={AddContactScreen}
        options={{ headerTitle: "Add Contacts" }}
      />
    </Stack.Navigator>
  );
}

// Main App Component
export default function App() {
  return (
    <AppContextProvider>
      <UserProvider>
        <Navigation />
      </UserProvider>
    </AppContextProvider>
  );
}

const styles = StyleSheet.create({
  headerButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginRight: 10,
  },
  headerButton: {
    marginLeft: 10,
    padding: 5,
    borderRadius: 8,
    backgroundColor: "#f0f4f8",
    elevation: 3,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ecf0f1",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 18,
    color: "#555",
    fontWeight: "500",
  },
});
