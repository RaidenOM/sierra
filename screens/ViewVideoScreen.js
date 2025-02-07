import { useRoute } from "@react-navigation/native";
import { StyleSheet, View } from "react-native";
import { ResizeMode, Video } from "expo-av";
import { Dimensions, Text } from "react-native";
import { useRef, useState } from "react";
import Slider from "@react-native-community/slider";

export default function ViewVideoScreen() {
  const routes = useRoute();
  const { mediaURL } = routes.params;
  const videoRef = useRef(null);

  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(1);

  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handlePlaybackStatusUpdate = (status) => {
    if (status?.isLoaded) {
      setProgress(status.positionMillis);
      setDuration(status.durationMillis || 1);
    }
  };

  const handleSeek = (value) => {
    if (videoRef.current) {
      videoRef.current.setPositionAsync(value);
    }
  };

  return (
    <View style={styles.container}>
      <Video
        ref={videoRef}
        source={{ uri: mediaURL }}
        isMuted={false}
        useNativeControls
        resizeMode={ResizeMode.CONTAIN}
        shouldPlay
        style={styles.video}
        onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
      />
      <View style={styles.sliderTimerContainer}>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={duration}
          value={progress}
          onSlidingComplete={handleSeek}
          minimumTrackTintColor="#1DB954"
          maximumTrackTintColor="#FFFFFF"
          thumbTintColor="#1DB954"
        />
        <Text style={styles.videoTime}>
          {formatTime(progress)} / {formatTime(duration)}
        </Text>
      </View>
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
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  slider: {
    flex: 1,
  },
  videoTime: {
    fontSize: 12,
    color: "#ccc",
    textAlign: "center",
  },
  sliderTimerContainer: {
    flexDirection: "row",
    position: "absolute",
    bottom: 30,
    paddingHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});
