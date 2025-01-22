import React, { useContext, useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ContactItem from "../components/ContactItem";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { UserContext } from "../store/user-context";

function AllContacts() {
  const { contacts, fetchContacts } = useContext(UserContext);
  const isFocused = useIsFocused();
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const getContacts = async () => {
      try {
        await fetchContacts();
      } catch (error) {
        console.error("Failed to fetch contacts", error);
        Alert.alert("Error", "Unable to fetch contacts.");
      } finally {
        setLoading(false);
      }
    };

    if (isFocused) getContacts();
  }, [isFocused]);

  const navigateToProfile = (userId) => {
    navigation.navigate("ProfileScreen", {
      id: userId,
      handleContactDelete: handleContactDelete,
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Fetching Contacts...</Text>
      </View>
    );
  }

  async function handleContactDelete(id) {
    try {
      const storedContacts = await AsyncStorage.getItem("contacts");
      if (storedContacts) {
        const contactsList = JSON.parse(storedContacts);
        const newContactsList = contactsList.filter(
          (contact) => contact.id !== id
        );
        const jsonValue = JSON.stringify(newContactsList);
        await AsyncStorage.setItem("contacts", jsonValue);
      }
    } catch (error) {
      console.error("Failed to delete contact", error);
      Alert.alert("Error", "Unable to delete contact.");
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Contacts</Text>
      {contacts.length > 0 ? (
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
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <View style={styles.noContactsContainer}>
          <Text style={styles.noContactsText}>No Contacts Found</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#dfe5f7",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#dfe5f7",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#555",
  },
  listContainer: {
    paddingBottom: 20,
  },
  noContactsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noContactsText: {
    fontSize: 16,
    color: "#777",
  },
});

export default AllContacts;
