import React, { useContext, useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from "react-native";
import ContactItem from "../components/ContactItem";
import { useNavigation } from "@react-navigation/native";
import { UserContext } from "../store/app-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { TouchableOpacity } from "react-native-gesture-handler";
import { LinearGradient } from "expo-linear-gradient";

function AllContacts() {
  const { contacts, fetchContacts, user, theme } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const isDarkTheme = theme === "dark";

  useEffect(() => {
    const getContacts = async () => {
      await fetchContacts();
      setLoading(false);
    };

    if (user) getContacts();
  }, [user]);

  const navigateToProfile = (contact) => {
    navigation.navigate("ProfileScreen", {
      id: contact._id,
    });
  };

  function renderContactList() {
    return (
      <>
        <View style={styles.refreshButtonContainer}>
          <Text
            style={[styles.title, { color: isDarkTheme ? "#EAEAEA" : "#333" }]}
          >
            Contacts
          </Text>
          {!loading ? (
            <TouchableOpacity
              onPress={async () => {
                setLoading(true);
                await fetchContacts();
                setLoading(false);
              }}
              disabled={loading}
            >
              <Ionicons name="refresh" size={24} color={"#7f8c8d"} />
            </TouchableOpacity>
          ) : (
            <ActivityIndicator color="#4CAF50" />
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
      </>
    );
  }

  return (
    <>
      {isDarkTheme ? (
        <View style={[styles.container, { backgroundColor: "black" }]}>
          {renderContactList()}
        </View>
      ) : (
        <LinearGradient
          style={styles.container}
          colors={[
            "rgb(215, 236, 250)",
            "rgb(239, 239, 255)",
            "rgb(255, 235, 253)",
          ]}
        >
          {renderContactList()}
        </LinearGradient>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
    color: "#7f8c8d",
  },
  refreshButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 15,
    paddingHorizontal: 15,
  },
});

export default AllContacts;
