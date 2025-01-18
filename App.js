import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
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
import { Button, StyleSheet, View } from "react-native";
import { UserContext, UserProvider } from "./store/user-context";
import { Text } from "react-native";
import UserProfileScreen from "./screens/UserProfileScreen";
import AddContactScreen from "./screens/AddContactScreen";

// Create navigators
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

function Navigation() {
  const { user, loading } = useContext(UserContext);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <NavigationContainer>
      {!user ? <AuthStack /> : <MainAppStack />}
    </NavigationContainer>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator>
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
    <Stack.Navigator>
      <Stack.Screen
        name="HomeTab"
        component={HomeTab}
        options={({ navigation }) => ({
          title: "Sierra",
          headerRight: () => (
            <View style={styles.headerButtonContainer}>
              <Button
                title="Profile"
                onPress={() => {
                  navigation.navigate("UserProfileScreen");
                }}
              />
              <Button
                title="Add Contact"
                onPress={() => {
                  navigation.navigate("AddContactScreen");
                }}
              />
              <Button
                title="Clear Data"
                onPress={() => {
                  clearData();
                }}
              />
            </View>
          ),
        })}
      />
      <Stack.Screen name="ChatScreen" component={ChatScreen} />
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
      <Stack.Screen name="UserProfileScreen" component={UserProfileScreen} />
      <Stack.Screen name="AddContactScreen" component={AddContactScreen} />
    </Stack.Navigator>
  );
}

async function clearData() {
  await AsyncStorage.clear();
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
  },
});
