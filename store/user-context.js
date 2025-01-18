import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

// Create a context to hold the user data
export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Store user data here
  const [loading, setLoading] = useState(true);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem("token");

        if (token) {
          const response = await axios.get("http://192.168.31.6:3000/profile", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          setUser(response.data); // Set user data after fetching
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

  const logout = async () => {
    await AsyncStorage.removeItem("token");
    setUser(null); // Clear user data on logout
  };

  return (
    <UserContext.Provider
      value={{ user, logout, loading, setIsAuthenticating }}
    >
      {children}
    </UserContext.Provider>
  );
};
