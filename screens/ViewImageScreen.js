import { useRoute } from "@react-navigation/native";
import { Image, StyleSheet, View } from "react-native";
import { StatusBar } from "react-native";

export default function ViewImageScreen() {
  const route = useRoute();
  const { mediaURL } = route.params;

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: mediaURL }}
        style={styles.imageStyle}
        resizeMode="contain"
      />
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
});
