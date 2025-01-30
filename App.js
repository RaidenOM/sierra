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
  ActivityIndicator,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useFonts } from "expo-font";
import { Orbitron_400Regular } from "@expo-google-fonts/orbitron";
import { CardStyleInterpolators } from "@react-navigation/stack";
import { TransitionSpecs } from "@react-navigation/stack";

// Screens
import AllContacts from "./screens/AllContacts";
import ChatScreen from "./screens/ChatScreen";
import ProfileScreen from "./screens/ProfileScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import UserProfileScreen from "./screens/UserProfileScreen";
import AllChats from "./screens/AllChats";

// Context
import { UserContext, UserProvider } from "./store/user-context";
import ViewImageScreen from "./screens/ViewImageScreen";

// Navigation Instances
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Home Tab Navigator
function HomeTab() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#fff",
        tabBarInactiveTintColor: "#ccc",
        tabBarStyle: {
          backgroundColor: "#3498db",
          borderTopLeftRadius: 15,
          borderTopRightRadius: 15,
        },
      }}
    >
      <Tab.Screen
        component={AllChats}
        name="AllChats"
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="logo-wechat" size={30} color={color} />
          ),
          tabBarLabel: "Chats",
        }}
      />
      <Tab.Screen
        component={AllContacts}
        name="AllContacts"
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="people-outline" size={30} color={color} />
          ),
          tabBarLabel: "Contacts",
        }}
      />
    </Tab.Navigator>
  );
}

// Auth Stack Navigator
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

// Main App Stack Navigator
function MainAppStack() {
  const [fontsLoaded] = useFonts({
    Orbitron_400Regular,
  });

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: "#3498db",
          shadowOpacity: 0.3,
        },
        headerTintColor: "#fff",
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        transitionSpec: {
          open: TransitionSpecs.TransitionIOSSpec,
          close: TransitionSpecs.TransitionIOSSpec,
        },
      }}
    >
      <Stack.Screen
        name="HomeTab"
        component={HomeTab}
        options={({ navigation }) => ({
          title: <Text style={styles.headerTitle}>SIΞRRΛ</Text>,
          headerRight: ({ tintColor }) => (
            <View style={styles.headerButtonContainer}>
              <TouchableOpacity
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
        name="ViewImageScreen"
        component={ViewImageScreen}
        options={{
          headerTitle: "Viewing Image",
          headerStyle: {
            backgroundColor: "black",
          },
        }}
      />
    </Stack.Navigator>
  );
}

// Main Navigation Component
function Navigation() {
  const { user, loading } = useContext(UserContext);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Image
          source={require("./assets/sierra.png")}
          resizeMode="center"
          style={{ height: 400 }}
        />
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {!user ? <AuthStack /> : <MainAppStack />}
    </NavigationContainer>
  );
}

// App Component
export default function App() {
  return (
    <>
      <UserProvider>
        <Navigation />
      </UserProvider>
      <StatusBar backgroundColor={"black"} barStyle={"light-content"} />
    </>
  );
}

// Styles
const styles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#3498db",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    paddingVertical: 10,
  },
  tabBarButton: {
    alignItems: "center",
  },
  headerTitle: {
    fontFamily: "Orbitron_400Regular",
    fontSize: 32,
    color: "#fff",
    letterSpacing: 4,
    textTransform: "uppercase",
    fontWeight: "bold",
    textShadowColor: "#333",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 10,
  },
  headerButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginRight: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});
