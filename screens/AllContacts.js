import { FlatList, StyleSheet, Text, View } from "react-native";
import { users, contacts } from "../backend";
import ContactItem from "../components/ContactItem";
import { useNavigation } from "@react-navigation/native";

const usersInContact = contacts.map((contact) =>
  users.find((user) => user.id === contact.userId)
);

function AllContacts() {
  const navigation = useNavigation();

  const navigate = (userId) => {
    navigation.navigate("ProfileScreen", { userId });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Contacts</Text>
      <FlatList
        data={usersInContact}
        renderItem={({ item }) => (
          <ContactItem
            name={item.username}
            bio={item.bio}
            profilePhoto={item.profilePhoto}
            key={item.id}
            onPress={() => {
              navigate(item.id);
            }}
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
