import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { io } from "socket.io-client";
import * as Contacts from "expo-contacts";
import { Alert } from "react-native";
import { normalizePhoneNumber } from "../utils/UtilityFunctions";
import { Orbitron_400Regular, useFonts } from "@expo-google-fonts/orbitron";
import { Audio } from "expo-av";

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
  const [messageRecievedSound, setMessageReceivedSound] = useState(null);
  const [messageSentSound, setMessageSentSound] = useState(null);
  const [theme, setTheme] = useState("dark");
  const [fontsLoaded] = useFonts({
    Orbitron_400Regular,
  });
  const [typingUsers, setTypingUsers] = useState({});

  // fetch theme from device local storage
  useEffect(() => {
    const loadTheme = async () => {
      const storedTheme = await AsyncStorage.getItem("theme");
      if (storedTheme) {
        setTheme(storedTheme);
      } else {
        setTheme("dark");
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
        console.log(token);

        if (token) {
          const response = await axios.get(
            "https://sierra-backend.onrender.com/profile",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          setToken(token);
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
    setUser(null);
    setToken(null);
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
