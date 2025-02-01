import { useRoute } from "@react-navigation/native";
import { StyleSheet, View } from "react-native";
import { Video } from "expo-av";
import { Dimensions } from "react-native";

export default function ViewVideoScreen() {
  const routes = useRoute();
  const { mediaURL } = routes.params;

  return (
    <View style={styles.container}>
      <Video
        source={{ uri: mediaURL }} // The video URI passed as a param
        rate={1.0} // Normal speed
        volume={1.0} // Max volume
        isMuted={false} // Sound on
        resizeMode="contain" // Maintain aspect ratio
        shouldPlay // Automatically start playing
        isLooping // Optional: loop the video
        style={styles.video}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  video: {
    width: Dimensions.get("window").width, // Full screen width
    height: Dimensions.get("window").height, // Full screen height
  },
});
