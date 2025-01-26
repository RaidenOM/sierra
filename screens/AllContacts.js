import React, { useContext, useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Alert,
} from "react-native";
import ContactItem from "../components/ContactItem";
import { useNavigation } from "@react-navigation/native";
import { UserContext } from "../store/user-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { TouchableOpacity } from "react-native-gesture-handler";

function AllContacts() {
  const { contacts, fetchContacts } = useContext(UserContext);
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

    getContacts();
  }, []);

  const navigateToProfile = (contact) => {
    navigation.navigate("ProfileScreen", {
      id: contact._id,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.refreshButtonContainer}>
        <Text style={styles.title}>Contacts</Text>
        {!loading ? (
          <TouchableOpacity
            onPress={async () => {
              setLoading(true);
              await fetchContacts();
              setLoading(false);
            }}
            disabled={loading}
          >
            <Ionicons name="refresh" size={24} color={"#999896"} />
          </TouchableOpacity>
        ) : (
          <ActivityIndicator />
        )}
      </View>
      {contacts.length > 0 ? (
        <FlatList
          data={contacts}
          keyExtractor={(item) => item._id.toString()}
          renderItem={({ item }) => (
            <ContactItem
              name={item.username + " (" + item.savedName + ")"}
              bio={item.bio}
              profilePhoto={item.profilePhoto}
              onPress={() => navigateToProfile(item)}
            />
          )}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <View style={styles.noContactsContainer}>
          <Text style={styles.noContactsText}>
            {loading ? "Fetching Contacts..." : "No Contacts Found"}
          </Text>
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
  refreshButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
});

export default AllContacts;
