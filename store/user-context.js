import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { io } from "socket.io-client";
import * as Contacts from "expo-contacts";
import { Alert } from "react-native";
import { normalizePhoneNumber } from "../utils/UtilityFunctions";

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
      // request permission
      const { status } = await Contacts.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission denied",
          "Cannot access contacts without permission."
        );
        return;
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
          savedName: phoneContact?.name || "No Name", // Saved name or fallback
        };
      });

      setContacts(contactsWithNameAndUsername);
    } catch (error) {
      console.error("Failed to fetch contacts", error);
      Alert.alert("Error", "Unable to fetch contacts.");
    } finally {
      setLoading(false);
    }
  };

  // join room if successsful login
  useEffect(() => {
    if (user) {
      console.log("Joining room " + user._id);
      socket.emit("join-room", user._id);
    }
  }, [user]);

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
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
