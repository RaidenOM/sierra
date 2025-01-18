import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AllChats from "./screens/AllChats";
import AllContacts from "./screens/AllContacts";
import ChatScreen from "./screens/ChatScreen";
import ProfileScreen from "./screens/ProfileScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import { AppContextProvider } from "./store/app-context";
import { Button } from "react-native";
import { UserContext, UserProvider } from "./store/user-context";
import { Text } from "react-native";
import UserProfileScreen from "./screens/UserProfileScreen";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Tab Navigator for Home Screens
function HomeTab() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen component={AllChats} name="AllChats" />
      <Tab.Screen component={AllContacts} name="AllContacts" />
    </Tab.Navigator>
  );
}

// Main App Component
export default function App() {
  const { user, loading } = useContext(UserContext);
  const navigation = useNavigation();

  if (loading) {
    return <Text>Loading...</Text>; // Show loading state until user data is fetched
  }

  return (
    <Stack.Navigator>
      {!user ? (
        // Authentication Stack
        <>
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
        </>
      ) : (
        // Home Stack
        <>
          <Stack.Screen
            component={HomeTab}
            name="HomeTab"
            options={{
              title: "Sierra",
              headerRight: ({ tintColor }) => (
                <Button
                  title="Profile"
                  onPress={() => {
                    navigation.navigate("UserProfileScreen");
                  }}
                />
              ),
            }}
          />
          <Stack.Screen component={ChatScreen} name="ChatScreen" />
          <Stack.Screen component={ProfileScreen} name="ProfileScreen" />
          <Stack.Screen
            component={UserProfileScreen}
            name="UserProfileScreen"
          />
        </>
      )}
    </Stack.Navigator>
  );
}
