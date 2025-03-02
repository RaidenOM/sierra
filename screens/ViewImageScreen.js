import { useNavigation, useRoute } from "@react-navigation/native";
import { useLayoutEffect } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { StatusBar } from "react-native";

export default function ViewImageScreen() {
  const route = useRoute();
  const { mediaURL, username } = route.params;
  const navigation = useNavigation();

  useLayoutEffect(() => {
    const setTitle = () => {
      navigation.setOptions({
        headerTitle: () => (
          <View>
            <Text
              style={{
                fontFamily: "Orbitron_400Regular",
                fontSize: 20,
                color: "#fff",
              }}
            >
              {username ? username : "Viewing Image"}
            </Text>
          </View>
        ),
      });
    };

    setTitle();
  }, [username]);

  return (
    <View style={styles.container}>
      {mediaURL ? (
        <Image
          source={{ uri: mediaURL }}
          style={styles.imageStyle}
          resizeMode="contain"
        />
      ) : (
        <Text style={{ color: "#7f8c8d" }}>No Profile Photo</Text>
      )}
      <StatusBar backgroundColor={"black"} barStyle={"light-content"} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },
  imageStyle: {
    flex: 1,
    width: "100%",
  },
  headerTitle: {
    fontFamily: "Orbitron_400Regular",
    fontSize: 20,
    color: "#6993ff",
  },
});
