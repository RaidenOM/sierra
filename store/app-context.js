import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { createContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import BootSplash from 'react-native-bootsplash';

export const AppContext = createContext();

export default function AppProvider({ children }) {
  const [user, setUser] = useState();
  const [token, setToken] = useState();
  const [appLoading, setAppLoading] = useState(true);

  // fetch user data using token on device
  useEffect(() => {
    const fetchUser = async () => {
      await BootSplash.hide();
      let userFound = false;
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          const response = await axios.get(
            'https://sierra-backend.onrender.com/profile',
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );
          userFound = true;
          setUser(response.data);
          setToken(token);
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch user data');
      } finally {
        if (userFound) setAppLoading(false);
        else
          setTimeout(() => {
            setAppLoading(false);
          }, 5000);
      }
    };

    fetchUser();
  }, []);

  // function to log in user and store the token
  const login = async (username, password) => {
    try {
      const response = await axios.post(
        'https://sierra-backend.onrender.com/login',
        {
          username: username,
          password: password,
        },
      );

      const { token, user } = response.data;

      await AsyncStorage.setItem('token', token);

      setToken(token);
      setUser(user);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'An error occured';
      Alert.alert('Error', errorMessage);
    }
  };

  // function to delete token and logout
  const logout = async () => {
    await AsyncStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AppContext.Provider value={{ user, token, login, appLoading, logout }}>
      {children}
    </AppContext.Provider>
  );
}
