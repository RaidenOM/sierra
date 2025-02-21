import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { io } from "socket.io-client";
import * as Contacts from "expo-contacts";
import { Alert, Platform } from "react-native";
import { normalizePhoneNumber } from "../utils/UtilityFunctions";
import { Orbitron_400Regular, useFonts } from "@expo-google-fonts/orbitron";
import { Audio } from "expo-av";
import * as Notifications from "expo-notifications";
import { useNavigation } from "@react-navigation/native";

// connect socket io to backend
const socket = io("https://sierra-backend.onrender.com", {
  transports: ["websocket"],
});

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [token, setToken] = useState();
  const [pushToken, setPushToken] = useState();
  const [messageRecievedSound, setMessageReceivedSound] = useState(null);
  const [messageSentSound, setMessageSentSound] = useState(null);
  const [theme, setTheme] = useState("dark");
  const [fontsLoaded] = useFonts({
    Orbitron_400Regular,
  });
  const [typingUsers, setTypingUsers] = useState({});
  const navigation = useNavigation();

  Notifications.setNotificationHandler({
    handleNotification: async () => {
      return {
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowAlert: true,
      };
    },
  });

  // set notifications handler
  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const receiverId =
          response.notification.request.content.data.receiverId;
        console.log(receiverId);
        navigation.navigate("ChatScreen", { receiverId: receiverId });
      }
    );

    const subscription2 = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log("Notification received:", notification);
        console.log(
          "Attachment URL:",
          notification.request.content.attachments
        );
      }
    );

    return () => {
      subscription.remove();
      subscription2.remove();
    };
  }, []);

  // configure push notification
  useEffect(() => {
    const configurePushNotification = async () => {
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

      const pushTokenData = await Notifications.getExpoPushTokenAsync();
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

      if (Platform.OS === "android") {
        Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidNotificationPriority.DEFAULT,
        });
      }
    };

    if (user) configurePushNotification();
  }, [user]);

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

  // join room if successsful login
  useEffect(() => {
    if (user) {
      console.log("Joining room " + user._id);
      socket.emit("join-room", user._id);
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
      if (messageRecievedSound) messageRecievedSound.unloadAsync();
      if (messageSentSound) messageSentSound.unloadAsync();
    };
  }, []);

  const playMessageReceivedSound = async () => {
    if (messageRecievedSound) {
      await messageRecievedSound.replayAsync();
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
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
