import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  StatusBar,
  Image,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { CardStyleInterpolators } from "@react-navigation/stack";
import { TransitionSpecs } from "@react-navigation/stack";
import AllContacts from "./screens/AllContacts";
import ChatScreen from "./screens/ChatScreen";
import ProfileScreen from "./screens/ProfileScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import UserProfileScreen from "./screens/UserProfileScreen";
import AllChats from "./screens/AllChats";
import { UserContext, UserProvider } from "./store/app-context";
import ViewImageScreen from "./screens/ViewImageScreen";
import ViewVideoScreen from "./screens/ViewVideoScreen";
import EditProfileScreen from "./screens/EditProfileScreen";
import { ChatProvider } from "./store/chat-context";
import AppInfo from "./screens/AppInfo";
import ChatBotScreen from "./screens/ChatBotScreen";
import * as Progress from "react-native-progress";
import SettingsScreen from "./screens/SettingsScreen";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function HomeTab() {
  const { theme } = useContext(UserContext);
  const isDarkTheme = theme === "dark";
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#6993ff",
        tabBarInactiveTintColor: "#7f8c8d",
        tabBarStyle: {
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -5 },
          shadowOpacity: 0.25,
          shadowRadius: 5,
          elevation: 5,
          backgroundColor: isDarkTheme ? "rgb(30, 30, 30)" : "white",
          borderTopWidth: 0,
        },
        paddingVertical: 10,
      }}
    >
      <Tab.Screen
        component={AllChats}
        name="AllChats"
        options={{
          tabBarIcon: ({ color, focused, size }) => (
            <Ionicons
              name={focused ? "chatbubbles" : "chatbubbles-outline"}
              size={size}
              color={color}
            />
          ),
          tabBarLabel: "Chats",
        }}
      />
      <Tab.Screen
        component={AllContacts}
        name="AllContacts"
        options={{
          tabBarIcon: ({ color, focused, size }) => (
            <Ionicons
              name={focused ? "people" : "people-outline"}
              size={size}
              color={color}
            />
          ),
          tabBarLabel: "Contacts",
        }}
      />
    </Tab.Navigator>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        transitionSpec: {
          open: TransitionSpecs.TransitionIOSSpec,
          close: TransitionSpecs.TransitionIOSSpec,
        },
      }}
    >
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

function MainAppStack() {
  const { theme, toggleTheme } = useContext(UserContext);
  const isDarkTheme = theme === "dark";
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 5 },
          shadowOpacity: 0.25,
          shadowRadius: 5,
          elevation: 5,
          backgroundColor: isDarkTheme ? "rgb(30, 30, 30)" : "white",
          borderBottomWidth: 0,
        },
        headerTintColor: "#6993ff",
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        transitionSpec: {
          open: TransitionSpecs.TransitionIOSSpec,
          close: TransitionSpecs.TransitionIOSSpec,
        },
        headerBackTitleVisible: false,

        headerTitleStyle: { fontSize: 20, fontWeight: "regular" },
      }}
    >
      <Stack.Screen
        name="HomeTab"
        component={HomeTab}
        options={({ navigation }) => ({
          headerLeft: ({ tintColor }) => (
            <Text style={[styles.headerTitle, { color: tintColor }]}>
              Sierra
            </Text>
          ),
          headerTitle: "",
          headerRight: ({ tintColor }) => (
            <View style={styles.headerButtonContainer}>
              <TouchableOpacity
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onPress={() => {
                  navigation.navigate("SettingsScreen");
                }}
              >
                <Ionicons
                  name="settings-outline"
                  size={25}
                  color={isDarkTheme ? "white" : "black"}
                />
              </TouchableOpacity>
            </View>
          ),
        })}
      />
      <Stack.Screen
        name="ChatScreen"
        component={ChatScreen}
        options={{ headerTitle: "" }}
      />
      <Stack.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{
          headerTitle: () => (
            <View>
              <Text
                style={{
                  fontFamily: "Orbitron_400Regular",
                  fontSize: 20,
                  color: "#6993ff",
                }}
              >
                Profile
              </Text>
            </View>
          ),
        }}
      />
      <Stack.Screen
        name="UserProfileScreen"
        component={UserProfileScreen}
        options={{
          headerTitle: () => (
            <View>
              <Text
                style={{
                  fontFamily: "Orbitron_400Regular",
                  fontSize: 20,
                  color: "#6993ff",
                }}
              >
                User Details
              </Text>
            </View>
          ),
        }}
      />
      <Stack.Screen
        name="ViewImageScreen"
        component={ViewImageScreen}
        options={{
          title: "",
          headerStyle: {
            backgroundColor: "black",
          },
        }}
      />
      <Stack.Screen
        name="ViewVideoScreen"
        component={ViewVideoScreen}
        options={{
          headerTitle: () => (
            <View>
              <Text
                style={{
                  fontFamily: "Orbitron_400Regular",
                  fontSize: 20,
                  color: "#fff",
                }}
              >
                Playing Video
              </Text>
            </View>
          ),
          headerStyle: { backgroundColor: "black" },
        }}
      />
      <Stack.Screen
        name="EditProfileScreen"
        component={EditProfileScreen}
        options={{
          headerTitle: () => (
            <View>
              <Text
                style={{
                  fontFamily: "Orbitron_400Regular",
                  fontSize: 20,
                  color: "#6993ff",
                }}
              >
                Edit Profile
              </Text>
            </View>
          ),
        }}
      />
      <Stack.Screen
        component={AppInfo}
        name="AppInfo"
        options={{
          headerTitle: () => (
            <View>
              <Text
                style={{
                  fontFamily: "Orbitron_400Regular",
                  fontSize: 20,
                  color: "#6993ff",
                }}
              >
                About
              </Text>
            </View>
          ),
        }}
      />
      <Stack.Screen
        component={ChatBotScreen}
        name="ChatBotScreen"
        options={{
          headerTitle: () => (
            <View>
              <Text
                style={{
                  fontFamily: "Orbitron_400Regular",
                  fontSize: 20,
                  color: "#6993ff",
                }}
              >
                Sierra Intelligence
              </Text>
            </View>
          ),
        }}
      />
      <Stack.Screen
        component={SettingsScreen}
        name="SettingsScreen"
        options={{
          headerTitle: () => (
            <View>
              <Text
                style={{
                  fontFamily: "Orbitron_400Regular",
                  fontSize: 20,
                  color: "#6993ff",
                }}
              >
                Settings
              </Text>
            </View>
          ),
        }}
      />
    </Stack.Navigator>
  );
}

function Navigation() {
  const { user, loading, fontsLoaded, theme } = useContext(UserContext);
  const isDarkTheme = theme === "dark";

  if (loading || !fontsLoaded) {
    return (
      <>
        <View
          style={[
            styles.loadingContainer,
            { backgroundColor: isDarkTheme ? "black" : "white" },
          ]}
        >
          <View
            style={{
              flex: 1,
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            <Image
              source={require("./assets/sierra.png")}
              resizeMode="contain"
              style={{ width: 150, height: 150 }}
            />
          </View>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Progress.Bar
              indeterminate
              color={isDarkTheme ? "#ffffffaa" : "#000000aa"}
              width={150}
              borderWidth={0}
              unfilledColor={isDarkTheme ? "#333" : "#ccc"}
            />
            <Text style={{ marginTop: 20, color: "#7f8c8d" }}>
              Designed by Om Kumar
            </Text>
          </View>
        </View>
        <StatusBar
          backgroundColor={isDarkTheme ? "black" : "white"}
          barStyle={isDarkTheme ? "light-content" : "dark-content"}
        />
      </>
    );
  }

  return (
    <>
      {!user ? <AuthStack /> : <MainAppStack />}
      <StatusBar
        backgroundColor={isDarkTheme ? "black" : "white"}
        barStyle={isDarkTheme ? "light-content" : "dark-content"}
      />
    </>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <ChatProvider>
        <UserProvider>
          <Navigation />
        </UserProvider>
      </ChatProvider>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  headerTitle: {
    fontFamily: "Orbitron_400Regular",
    fontSize: 32,
    marginLeft: 15,
  },
  headerButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginRight: 15,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
});

/*
Dark Mode (=  )
Profile Details
Logout
Delete Profile
App Info
*/
