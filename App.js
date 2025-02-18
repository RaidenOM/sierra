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
import { CardStyleInterpolators } from "@react-navigation/stack";
import { TransitionSpecs } from "@react-navigation/stack";
import AllContacts from "./screens/AllContacts";
import ChatScreen from "./screens/ChatScreen";
import ProfileScreen from "./screens/ProfileScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import UserProfileScreen from "./screens/UserProfileScreen";
import AllChats from "./screens/AllChats";
import { UserContext, UserProvider } from "./store/user-context";
import ViewImageScreen from "./screens/ViewImageScreen";
import ViewVideoScreen from "./screens/ViewVideoScreen";
import EditProfileScreen from "./screens/EditProfileScreen";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function HomeTab() {
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
        },
        paddingVertical: 10,
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
            <Ionicons name="people" size={30} color={color} />
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
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 5 },
          shadowOpacity: 0.25,
          shadowRadius: 5,
          elevation: 5,
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
          headerTitle: ({ tintColor }) => (
            <Text style={[styles.headerTitle, { color: tintColor }]}>
              Sierra
            </Text>
          ),
          headerRight: ({ tintColor }) => (
            <View style={styles.headerButtonContainer}>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("UserProfileScreen");
                }}
              >
                <Ionicons name="person-circle" size={30} color={tintColor} />
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
          headerTitle: () => (
            <View>
              <Text
                style={{
                  fontFamily: "Orbitron_400Regular",
                  fontSize: 20,
                  color: "#fff",
                }}
              >
                Viewing Image
              </Text>
            </View>
          ),
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
    </Stack.Navigator>
  );
}

function Navigation() {
  const { user, loading, fontsLoaded } = useContext(UserContext);

  if (loading || !fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <Image
          source={require("./assets/sierra.png")}
          resizeMode="center"
          style={{ height: 400 }}
        />
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={{ marginTop: 20, color: "#7f8c8d" }}>
          Designed by Om Kumar
        </Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      {!user ? <AuthStack /> : <MainAppStack />}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <>
      <UserProvider>
        <Navigation />
      </UserProvider>
      <StatusBar backgroundColor={"white"} barStyle={"dark-content"} />
    </>
  );
}

const styles = StyleSheet.create({
  headerTitle: {
    fontFamily: "Orbitron_400Regular",
    fontSize: 32,
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
