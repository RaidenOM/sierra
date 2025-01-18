import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import ContactItem from "../components/ContactItem";
import { useIsFocused, useNavigation } from "@react-navigation/native";

function AllContacts() {
  const [contacts, setContacts] = useState([]); // Store the contact list
  const isFocused = useIsFocused();
  const [loading, setLoading] = useState(true); // To show loading state
  const navigation = useNavigation();

  // Fetch contacts from AsyncStorage and user profiles from the server
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const storedContacts = await AsyncStorage.getItem("contacts");
        if (storedContacts) {
          const contactList = JSON.parse(storedContacts);
          console.log(contactList);
          // Fetch profiles for each contact
          const profilePromises = contactList.map((contact) =>
            axios.get(`http://192.168.31.6:3000/users/${contact.id}`)
          );

          // Wait for all profile data to be fetched
          const profileResponses = await Promise.all(profilePromises);
          const profileData = profileResponses.map((response) => response.data);
          setContacts(profileData);
        } else {
          Alert.alert("No contacts", "You have no contacts saved.");
        }
      } catch (error) {
        console.error("Failed to fetch contacts", error);
        Alert.alert("Error", "Unable to fetch contacts.");
      } finally {
        setLoading(false); // Stop loading after fetching data
      }
    };

    fetchContacts();
  }, [isFocused]);

  // Function to navigate to Profile Screen
  const navigateToProfile = (userId) => {
    navigation.navigate("ProfileScreen", { id: userId });
  };

  // Show loading indicator while fetching data
  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading Contacts...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Contacts</Text>
      <FlatList
        data={contacts}
        keyExtractor={(item) => item._id.toString()}
        renderItem={({ item }) => (
          <ContactItem
            name={item.username}
            bio={item.bio}
            profilePhoto={item.profilePhoto}
            onPress={() => navigateToProfile(item._id)}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
});

export default AllContacts;
