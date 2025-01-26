import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { useContext } from "react";
import AllContacts from "./screens/AllContacts";
import ChatScreen from "./screens/ChatScreen";
import ProfileScreen from "./screens/ProfileScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  StatusBar,
  Image,
} from "react-native";
import { UserContext, UserProvider } from "./store/user-context";
import UserProfileScreen from "./screens/UserProfileScreen";
import { ActivityIndicator } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import AllChats from "./screens/AllChats";

import { useFonts } from "expo-font";
import { Orbitron_400Regular } from "@expo-google-fonts/orbitron";
import { createStackNavigator } from "@react-navigation/stack";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

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
        animation: "slide_from_right",
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
    </Stack.Navigator>
  );
}

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

const styles = StyleSheet.create({
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
