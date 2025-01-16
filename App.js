import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AllChats from "./screens/AllChats";
import AllContacts from "./screens/AllContacts";
import ChatScreen from "./screens/ChatScreen";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import ProfileScreen from "./screens/ProfileScreen";
import { AppContextProvider } from "./store/app-context";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function HomeTab() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen component={AllChats} name="AllChats" />
      <Tab.Screen component={AllContacts} name="AllContacts" />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <AppContextProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            component={HomeTab}
            name="HomeTab"
            options={{ title: "Sierra" }}
          />
          <Stack.Screen component={ChatScreen} name="ChatScreen" />
          <Stack.Screen component={ProfileScreen} name="ProfileScreen" />
        </Stack.Navigator>
      </NavigationContainer>
    </AppContextProvider>
  );
}
