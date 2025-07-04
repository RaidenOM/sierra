import { useContext, useState } from "react";
import { UserContext } from "../store/app-context";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ActivityIndicator } from "react-native";
import CustomButton from "../components/CustomButton";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import CustomInput from "../components/CustomInput";

export default function EditProfileScreen() {
  const { user, token, setIsAuthenticating, logout, theme } =
    useContext(UserContext);
  const [bio, setBio] = useState(user.bio);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const [cameraPermissionInfo, requestPermission] =
    ImagePicker.useCameraPermissions();

  const [pickedImageUri, setPickedImageUri] = useState();
  const [viewProfilePhoto, setViewProfilePhoto] = useState(user.profilePhoto);

  const isDarkTheme = theme === "dark";

  const handleRemoveProfilePhoto = () => {
    setViewProfilePhoto("");
  };

  const getPermissions = async () => {
    if (
      cameraPermissionInfo.status ===
        ImagePicker.PermissionStatus.UNDETERMINED ||
      cameraPermissionInfo.status === ImagePicker.PermissionStatus.DENIED
    ) {
      const permissionResponse = await requestPermission();
      return permissionResponse.granted;
    }

    return true;
  };

  const handleImagePick = async () => {
    const permissionsResult = await getPermissions();
    if (!permissionsResult) {
      Alert.alert(
        "Permissions denied",
        "Permission to access image is required to proceed."
      );
      return;
    }

    const imagePick = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });

    if (!imagePick.canceled) {
      setPickedImageUri(imagePick.assets[0].uri);
      setViewProfilePhoto(imagePick.assets[0].uri);
    }
  };

  const handleConfirm = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append("bio", bio);

    if (pickedImageUri) {
      const imageUri = pickedImageUri;
      const uriParts = imageUri.split(".");
      const fileType = uriParts[uriParts.length - 1];

      formData.append("profilePhoto", {
        uri: imageUri,
        name: `photo.${fileType}`,
        type: `image/${fileType}`,
      });
    } else if (!viewProfilePhoto) {
      formData.append("unsetProfilePhoto", true);
    } else {
      formData.append("unsetProfilePhoto", false);
    }

    try {
      await axios({
        method: "put",
        url: `https://sierra-backend.onrender.com/users/${user._id}`,
        data: formData,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setIsAuthenticating(true);
      navigation.goBack();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const profileDeleteHandler = async () => {
    Alert.alert(
      "Delete Profile",
      "Are you sure you want to delete your profile and all data related to it?",
      [
        { style: "cancel", text: "Cancel" },
        {
          style: "destructive",
          text: "Yes",
          onPress: async () => {
            await axios.delete("https://sierra-backend.onrender.com/profile", {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            await logout();
          },
        },
      ]
    );
  };

  function renderContent() {
    return (
      <>
        <View
          style={[
            styles.card,
            { backgroundColor: isDarkTheme ? "rgb(30,30,30)" : "white" },
          ]}
        >
          <View style={styles.profileImage}>
            <Image
              source={
                viewProfilePhoto
                  ? { uri: viewProfilePhoto }
                  : require("../assets/image/user.png")
              }
              style={{ width: "100%", height: "100%", borderRadius: 60 }}
            />
            <TouchableOpacity
              style={styles.editProfilePhotoIcon}
              onPress={handleImagePick}
            >
              <Ionicons name="pencil" size={20} color="blue" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteProfilePhotoIcon}
              onPress={handleRemoveProfilePhoto}
            >
              <Ionicons name="trash" size={20} color="red" />
            </TouchableOpacity>
          </View>
          <View style={styles.bioContainer}>
            <Text style={styles.label}>Your Bio</Text>
            <CustomInput
              style={{
                backgroundColor: isDarkTheme ? "black" : "white",
                maxHeight: 100,
              }}
              value={bio}
              onChangeText={setBio}
              placeholder="Enter bio"
              multiline
            />
          </View>
          <CustomButton onPress={handleConfirm} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : "Update Profile"}
          </CustomButton>
        </View>
      </>
    );
  }

  return (
    <>
      {isDarkTheme ? (
        <View style={[styles.container, { backgroundColor: "black" }]}>
          {renderContent()}
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
          {renderContent()}
        </LinearGradient>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    width: "90%",
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 25,
  },
  editProfilePhotoIcon: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "#ccc",
    height: 40,
    width: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    opacity: 0.7,
    padding: 10,
  },
  deleteProfilePhotoIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#ccc",
    height: 40,
    width: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    padding: 10,
    opacity: 0.7,
  },
  bioContainer: {
    width: "100%",
    marginBottom: 50,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
    paddingLeft: 5,
    color: "#7f8c8d",
  },
});
