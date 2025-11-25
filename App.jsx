import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ThemeProvider from './store/theme-context';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import AppProvider, { AppContext } from './store/app-context';
import { useContext } from 'react';
import { Icon, IconButton, Text, useTheme } from 'react-native-paper';
import AllChatsScreen from './screens/AllChatsScreen';
import AllContactsScreen from './screens/AllContactsScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SplashScreen from './screens/SplashScreen';
import SettingsScreen from './screens/SettingsScreen';
import ChatScreen from './screens/ChatScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false, animation: 'slide_from_right' }}
    >
      <Stack.Screen component={LoginScreen} name="LoginScreen" />
      <Stack.Screen component={RegisterScreen} name="RegisterScreen" />
    </Stack.Navigator>
  );
}

function HomeTabs() {
  const theme = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
        tabBarStyle: {
          backgroundColor: theme.dark
            ? theme.colors.surface
            : theme.colors.elevation.level1,
          height: 60,
          paddingTop: 4,
          borderTopWidth: 0,
        },
      }}
    >
      <Tab.Screen
        component={AllChatsScreen}
        name="AllChatsScreen"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon source="message-text-outline" size={size} color={color} />
          ),
          tabBarLabel: ({ color }) => (
            <Text variant="bodySmall" style={{ color: color }}>
              Chats
            </Text>
          ),
        }}
      />
      <Tab.Screen
        component={AllContactsScreen}
        name="AllContactsScreen"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon source="contacts-outline" size={size} color={color} />
          ),
          tabBarLabel: ({ color }) => (
            <Text variant="bodySmall" style={{ color: color }}>
              Contacts
            </Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function MainAppStack() {
  const theme = useTheme();
  const { logout } = useContext(AppContext);
  return (
    <Stack.Navigator
      screenOptions={({ navigation, route }) => ({
        headerTintColor: theme.colors.primary,
        headerStyle: {
          backgroundColor: theme.dark
            ? theme.colors.surface
            : theme.colors.elevation.level1,
          elevation: 0,
          borderBottomWidth: 0,
        },

        animation: 'slide_from_right',
        animationTypeForReplace: 'pop',
      })}
    >
      <Stack.Screen
        component={HomeTabs}
        name="HomeTabs"
        options={{
          headerTitle: ({ tintColor }) => (
            <Text
              variant="headlineMedium"
              style={{ color: tintColor, fontFamily: 'Orbitron-Regular' }}
            >
              Sierra
            </Text>
          ),
          headerRight: ({ tintColor }) => (
            <IconButton icon="logout" iconColor={tintColor} onPress={logout} />
          ),
        }}
      />
      <Stack.Screen component={SettingsScreen} name="SettingsScreen" />
      <Stack.Screen
        component={ChatScreen}
        name="ChatScreen"
        options={{ headerTitle: '' }}
      />
    </Stack.Navigator>
  );
}

function Navigation() {
  const { user, appLoading } = useContext(AppContext);

  if (appLoading) return <SplashScreen />;

  return user ? <MainAppStack /> : <AuthStack />;
}

function App() {
  return (
    <ThemeProvider>
      <AppProvider>
        <NavigationContainer>
          <Navigation />
        </NavigationContainer>
      </AppProvider>
    </ThemeProvider>
  );
}

export default App;
