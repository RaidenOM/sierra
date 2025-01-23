import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { io } from "socket.io-client";

// connect socket io to backend
const socket = io("https://sierra-backend.onrender.com", {
  transports: ["websocket"],
});

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [latestMessages, setLatestMessages] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [token, setToken] = useState();

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
        console.error("Failed to fetch user data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [isAuthenticating]);

  // fetch latest messages for a user
  const fetchLatestMessages = async () => {
    try {
      if (token) {
        const response = await axios.get(
          "https://sierra-backend.onrender.com/latest-messages",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log(token);
        setLatestMessages(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch latest messages", error);
    } finally {
      setLoading(false);
    }
  };

  // fetch contacts for a user
  const fetchContacts = async () => {
    try {
      const storedContacts = await AsyncStorage.getItem("contacts");
      if (storedContacts) {
        const contactList = JSON.parse(storedContacts);

        const profilePromises = contactList.map((contact) => {
          return axios.get(
            `https://sierra-backend.onrender.com/users/${contact.id}`
          );
        });

        const profileResponses = await Promise.all(profilePromises);
        const profileData = profileResponses.map((response) => response.data);
        setContacts(profileData);
      }
    } catch (error) {
      console.error("Failed to fetch contacts", error);
      Alert.alert("Error", "Unable to fetch contacts.");
    } finally {
      setLoading(false);
    }
  };

  const addContact = async (contact) => {
    let contacts = await AsyncStorage.getItem("contacts");
    contacts = contacts ? JSON.parse(contacts) : [];

    // Add new contact to existing contacts
    contacts.push(contact);

    await AsyncStorage.setItem("contacts", JSON.stringify(contacts));
    await fetchContacts();
  };

  // join room if successsful login
  useEffect(() => {
    if (user) {
      socket.emit("join-room", user._id);
    }
  }, [user]);

  const logout = async () => {
    await AsyncStorage.removeItem("token");
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
        fetchLatestMessages,
        latestMessages,
        contacts,
        fetchContacts,
        addContact,
        setLatestMessages,
        token,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
