import React, { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { io } from "socket.io-client";
import * as Contacts from "expo-contacts";
import { Alert, AppState, Platform } from "react-native";
import { normalizePhoneNumber } from "../utils/UtilityFunctions";
import { Orbitron_400Regular, useFonts } from "@expo-google-fonts/orbitron";
import { Audio } from "expo-av";
import * as Notifications from "expo-notifications";
import { useNavigation } from "@react-navigation/native";
import Constants from "expo-constants";
import { ChatContext } from "./chat-context";

// connect socket io to backend
const socket = io("https://sierra-backend.onrender.com", {
  transports: ["websocket", "polling"],
});

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [token, setToken] = useState();
  const [pushToken, setPushToken] = useState();
  const [messageReceivedSound, setMessageReceivedSound] = useState(null);
  const [messageSentSound, setMessageSentSound] = useState(null);
  const [theme, setTheme] = useState("dark");
  const [fontsLoaded] = useFonts({
    Orbitron_400Regular,
  });
  const [typingUsers, setTypingUsers] = useState({});
  const { chats, setChats } = useContext(ChatContext);
  const navigation = useNavigation();
  const [appState, setAppState] = useState(AppState.currentState);

  Notifications.setNotificationHandler({
    handleNotification: async (notification) => {
      return {
        shouldShowAlert: AppState.currentState === "active" ? false : true,
        shouldPlaySound: AppState.currentState === "active" ? false : true,
        shouldSetBadge: AppState.currentState === "active" ? false : true,
      };
    },
  });

  // configure push notification
  useEffect(() => {
    const configurePushNotification = async () => {
      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
          name: "Default",
          importance: Notifications.AndroidImportance.HIGH,
          sound: "default",
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#FF231F7C",
        });
      }

      const { status } = await Notifications.getPermissionsAsync();
      let finalStatus = status;
      if (finalStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        Alert.alert(
          "Permission denied",
          "Permission needed to push notifications."
        );
        return;
      }

      const projectId =
        Constants?.expoConfig?.extra?.eas?.projectId ??
        Constants?.easConfig?.projectId;
      if (!projectId) {
        throw new Error("Project ID not found");
      }

      const pushTokenData = await Notifications.getExpoPushTokenAsync({
        projectId: projectId,
      });
      console.log({ pushtoken: pushTokenData.data });
      setPushToken(pushTokenData.data);

      // store the push token in backend
      await axios.put(
        "https://sierra-backend.onrender.com/store-push-token",
        { pushToken: pushTokenData.data },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    };

    if (user) configurePushNotification();
  }, [user]);

  // handle push notification tap when app is in background
  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const { receiverId } = response.notification.request.content.data;

        // set chat as marked in chats state
        setChats((prevChats) => {
          const updatedChats = [...prevChats];
          const indexToBeUpdated = updatedChats.findIndex(
            (chat) =>
              chat.senderId._id === receiverId ||
              chat.receiverId._id === receiverId
          );
          if (indexToBeUpdated >= 0) {
            updatedChats[indexToBeUpdated] = {
              ...updatedChats[indexToBeUpdated],
              unreadCount: 0,
              isRead: true,
            };
          }
          return updatedChats;
        });

        navigation.navigate("ChatScreen", { receiverId: receiverId });
      }
    );

    return () => {
      subscription.remove();
    };
  }, []);

  // fetch theme from device local storage
  useEffect(() => {
    const loadTheme = async () => {
      const storedTheme = await AsyncStorage.getItem("theme");
      if (storedTheme) {
        setTheme(storedTheme);
      } else {
        setTheme("light");
      }
    };

    loadTheme();
  }, []);

  // function to toggle theme
  const toggleTheme = async () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    await AsyncStorage.setItem("theme", newTheme);
  };

  // event handler to set typing users
  useEffect(() => {
    socket.on("typing", (data) => {
      setTypingUsers((prev) => ({ ...prev, [data.senderId]: true }));
    });

    socket.on("stop-typing", (data) => {
      setTypingUsers((prev) => ({ ...prev, [data.senderId]: false }));
    });

    return () => {
      socket.off("typing");
      socket.off("stop-typing");
    };
  }, []);

  // function to retrieve token from device and fetch user data from server based on token and store it in 'user' state and store the token in 'token' state
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        setToken(token);

        if (token) {
          const response = await axios.get(
            "https://sierra-backend.onrender.com/profile",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          setUser(response.data);
          setIsAuthenticating(false);
        }
      } catch (error) {
        Alert.alert("Error", "Failed to fetch user data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [isAuthenticating]);

  // fetch contacts for a user and match with backend
  const fetchContacts = async () => {
    try {
      const { status } = await Contacts.getPermissionsAsync();

      if (status != "granted") {
        const { status: newStatus } = await Contacts.requestPermissionsAsync();

        if (newStatus !== "granted") {
          Alert.alert(
            "Permission denied",
            "Cannot access contacts without permission."
          );
          return;
        }
      }

      // fetch phone numbers on device
      const { data } = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.PhoneNumbers],
      });

      // extract phone numbers and normalize them
      const numbers = data
        .flatMap((contact) => contact.phoneNumbers || [])
        .map((phone) => {
          let normalizedNumber = normalizePhoneNumber(phone.number);

          return normalizedNumber;
        });

      const response = await axios.post(
        "https://sierra-backend.onrender.com/match-phone",
        {
          phoneNumbers: numbers,
        }
      );

      const filteredContacts = response.data.filter(
        (contact) => contact.phone !== user.phone
      );

      const contactsWithNameAndUsername = filteredContacts.map((contact) => {
        const phoneContact = data.find((c) => {
          return (
            Array.isArray(c.phoneNumbers) &&
            c.phoneNumbers.some((p) => {
              return normalizePhoneNumber(p.number) === contact.phone;
            })
          );
        });

        return {
          ...contact,
          savedName: phoneContact?.name || "No Name",
        };
      });

      setContacts(contactsWithNameAndUsername);
    } catch (error) {
      console.error("Failed to fetch contacts", error);
      Alert.alert("Error", "Unable to fetch contacts.");
    }
  };

  // join room if successsful login or (if user is logged in and socket reconnects)
  useEffect(() => {
    if (user) {
      console.log("Joining room " + user._id);
      socket.emit("join-room", user._id);

      const handleReconnect = () => {
        console.log("Reconnected, rejoining room " + user._id);
        socket.emit("join-room", user._id);
      };

      socket.on("connect", handleReconnect);

      return () => {
        socket.off("connect", handleReconnect);
      };
    }
  }, [user]);

  // load message sent and received audios
  useEffect(() => {
    const loadSound = async () => {
      const { sound: receivedSound } = await Audio.Sound.createAsync(
        require("../assets/audio/message_received.mp3")
      );

      const { sound: sentSound } = await Audio.Sound.createAsync(
        require("../assets/audio/message_sent.mp3")
      );

      setMessageReceivedSound(receivedSound);
      setMessageSentSound(sentSound);
    };

    loadSound();

    return () => {
      if (messageReceivedSound) messageReceivedSound.unloadAsync();
      if (messageSentSound) messageSentSound.unloadAsync();
    };
  }, []);

  // handle app state change
  useEffect(() => {
    const handleAppStateChange = (nextState) => {
      console.log("App state changed");
      setAppState(nextState);
    };

    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );
    return () => subscription.remove();
  }, [user]);

  // reconnect user if app state chagnes and socket is disconnectd
  useEffect(() => {
    if (appState === "active" && user && !socket.connected) {
      socket.connect();
    }
  }, [user, socket, appState]);

  const playMessageReceivedSound = async () => {
    if (messageReceivedSound) {
      await messageReceivedSound.replayAsync();
    }
  };

  const playMessageSentSound = async () => {
    if (messageSentSound) {
      await messageSentSound.replayAsync();
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem("token");
    socket.emit("leave-room", user._id);
    if (socket.connected) socket.disconnect();

    // delete the push token from backend
    await axios.put(
      "https://sierra-backend.onrender.com/delete-push-token",
      {
        pushToken: pushToken,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setUser(null);
    setToken(null);
    setPushToken(null);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        logout,
        loading,
        setIsAuthenticating,
        socket,
        contacts,
        fetchContacts,
        token,
        fontsLoaded,
        typingUsers,
        playMessageSentSound,
        playMessageReceivedSound,
        theme,
        toggleTheme,
        appState,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
