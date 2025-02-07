import { Audio } from "expo-av";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import Ionicons from "@expo/vector-icons/Ionicons";
import Slider from "@react-native-community/slider";
import { useEffect } from "react";
import { useIsFocused } from "@react-navigation/native";

export default function AudioPlayer({
  uri,
  currentPlayingSound,
  setCurrentPlayingSound,
}) {
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const isFocused = useIsFocused();

  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);

  async function loadSound() {
    const { sound } = await Audio.Sound.createAsync(
      { uri: uri },
      { shouldPlay: false },
      (status) => {
        if (status.isLoaded) {
          setDuration(status.durationMillis);
        }
      }
    );

    setSound(sound);
  }

  useEffect(() => {
    loadSound();

    return () => {
      if (sound) sound.unloadAsync();
      if (currentPlayingSound === sound) setCurrentPlayingSound(null);
    };
  }, [uri]);

  useEffect(() => {
    if (sound && !isFocused) {
      sound.stopAsync();
      if (currentPlayingSound === sound) {
        setCurrentPlayingSound(null);
      }
    }
  }, [isFocused]);

  useEffect(() => {
    let interval;
    if (isPlaying && sound) {
      interval = setInterval(async () => {
        const status = await sound.getStatusAsync();
        if (status.isLoaded) {
          setPosition(status.positionMillis);
        }
      }, 500);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isPlaying, sound]);

  const playPauseSound = async () => {
    if (!sound) return;

    if (currentPlayingSound === null || currentPlayingSound !== sound) {
      if (currentPlayingSound) {
        await currentPlayingSound.pauseAsync();
        setCurrentPlayingSound(null);
      }
      if (position === duration) {
        setPosition(0);
        await sound.setPositionAsync(0);
      }
      await sound.playAsync();
      setCurrentPlayingSound(sound);
      setIsPlaying(true);
    } else {
      await currentPlayingSound.pauseAsync();
      setCurrentPlayingSound(null);
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    const autoPause = async () => {
      await sound.stopAsync();
      setIsPlaying(false);
      setCurrentPlayingSound(null);
    };

    if (sound && position === duration) autoPause();
  }, [position, sound]);

  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <View style={styles.audioPlayerContainer}>
      <TouchableOpacity onPress={playPauseSound}>
        <Ionicons
          name={isPlaying && currentPlayingSound === sound ? "pause" : "play"}
          size={24}
          color="#fff"
        />
      </TouchableOpacity>

      <Slider
        style={styles.audioSlider}
        minimumValue={0}
        maximumValue={duration}
        value={position}
        onSlidingComplete={async (value) => {
          await sound.setPositionAsync(value);
          setPosition(value);
        }}
        minimumTrackTintColor="#fff"
        thumbTintColor="#fff"
      />
      <Text style={styles.audioTime}>
        {formatTime(position)} / {formatTime(duration)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  audioPlayerContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    minWidth: 200,
    maxWidth: "100%",
  },
  audioSlider: {
    flex: 1,
    marginHorizontal: 10,
  },
  audioTime: {
    fontSize: 12,
    color: "#ccc",
  },
});
