import { useContext, useState, useEffect, useLayoutEffect } from "react";
import {
  Text,
  View,
  FlatList,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ImageBackground,
} from "react-native";
import {
  useIsFocused,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import axios from "axios";
import { UserContext } from "../store/user-context";
import { useRef } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { format } from "date-fns";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import { getThumbnailAsync } from "expo-video-thumbnails";
import AudioPlayer from "../components/AudioPlayer";

const getAudioMimeType = (extension) => {
  switch (extension.toLowerCase()) {
    case "mp3":
      return "audio/mpeg";
    case "wav":
      return "audio/wav";
    case "ogg":
      return "audio/ogg";
    case "m4a":
      return "audio/mp4";
    default:
      return "audio/*";
  }
};

function ChatScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { user, socket, token } = useContext(UserContext);
  const [sendLoading, setSendLoading] = useState(false);
  const { receiverId } = route.params;
  const [thumbnails, setThumbnails] = useState({});
  const [showPicker, setShowPicker] = useState(false);
  const [audioName, setAudioName] = useState("");
  const [inputHeight, setInputHeight] = useState(40);

  const [receiver, setReceiver] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedImageUri, setSelectedImageUri] = useState("");
  const [selectedVideoUri, setSelectedVideoUri] = useState("");
  const [selectedVideoThumbnail, setSelectedVideoThumbnail] = useState("");
  const [selectedDocumentUri, setSelectedDocumentUri] = useState("");
  const [selectedAudioUri, setSelectedAudioUri] = useState("");
  const [cameraPermissionInfo, requestPermission] =
    ImagePicker.useCameraPermissions();
  const isFocused = useIsFocused();

  const flatListRef = useRef(null);

  // Fetch receiver information
  useEffect(() => {
    async function findReceiverInfo() {
      try {
        const response = await axios.get(
          `https://sierra-backend.onrender.com/users/${receiverId}`
        );
        setReceiver(response.data);
      } catch (error) {
        console.error("Error fetching receiver info", error);
      }
    }
    findReceiverInfo();
  }, [receiverId]);

  // Fetch messages between the current user and the receiver
  useEffect(() => {
    async function fetchMessages() {
      try {
        const response = await axios.get(
          `https://sierra-backend.onrender.com/messages/${receiverId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setMessages(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching messages", error);
      }
    }

    if (receiver) {
      fetchMessages();
    }
  }, [token, receiverId, receiver]);

  // bind handler to handler emits from server
  useEffect(() => {
    socket.on("new-message", (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    return () => {
      socket.off("new-message");
    };
  }, [socket]);

  // bind handler to handler emits from server
  useEffect(() => {
    socket.on("message-sent", (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    return () => {
      socket.off("message-sent");
    };
  }, [socket]);

  // useEffect to mark messages as read between current user and other user on screen exit
  useEffect(() => {
    const markAsRead = async () => {
      console.log(receiverId);
      console.log(token);
      await axios.put(
        `https://sierra-backend.onrender.com/messages/mark-read/${receiverId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    };

    if (!isFocused) markAsRead();
  }, [isFocused, receiverId, token]);

  // useLayoutEffect to set the title for ChatScreen
  useLayoutEffect(() => {
    if (receiver)
      navigation.setOptions({
        headerTitle: () => (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("ProfileScreen", { id: receiverId });
            }}
            style={styles.headerTitle}
          >
            <Image
              source={{ uri: receiver.profilePhoto }}
              style={styles.headerProfileImage}
            />
            <Text style={styles.headerTitleUsername}>{receiver.username}</Text>
          </TouchableOpacity>
        ),
      });
    navigation.setOptions({
      headerRight: ({ tintColor }) => (
        <View style={styles.headerButtonContainer}>
          <TouchableOpacity
            onPress={async () => {
              await handleChatDelete(receiverId);
            }}
          >
            <Ionicons name="trash-outline" size={30} color="red" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [receiver]);

  useEffect(() => {
    const generateThumbnailEffect = async () => {
      const uri = await generateThumbnail(selectedVideoUri);
      setSelectedVideoThumbnail(uri);
    };

    if (selectedVideoUri) generateThumbnailEffect();
  }, [selectedVideoUri]);

  useEffect(() => {
    const generateThumbs = async () => {
      const newThumbnails = { ...thumbnails };

      const videoMessages = messages.filter(
        (message) =>
          message.mediaType === "video" && !newThumbnails[message._id]
      );

      for (const message of videoMessages) {
        try {
          const uri = await generateThumbnail(message.mediaURL);
          newThumbnails[message._id] = uri;
        } catch (error) {
          console.log(error);
        }
      }

      setThumbnails(newThumbnails);
    };

    generateThumbs();
  }, [messages]);

  const generateThumbnail = async (url) => {
    try {
      const { uri } = await getThumbnailAsync(url, { time: 1500 });
      return uri;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  // Sort messages based on sentAt field
  const sortedMessages = messages.sort((a, b) => {
    const dateA = new Date(a.sentAt);
    const dateB = new Date(b.sentAt);
    return dateA - dateB;
  });

  // Helper function to format dates
  const formatDate = (date) => {
    return format(new Date(date), "eee, MMMM dd, yyyy"); // Format as "Sun, January 26, 2025"
  };

  // Helper function to format time (e.g., "10:03 AM")
  const formatTime = (date) => {
    return format(new Date(date), "hh:mm a"); // Format as "10:03 AM"
  };

  async function handleChatDelete(otherUserId) {
    Alert.alert(
      "Delete Chats",
      "Are you sure you want to delete all chats with this user?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await axios.delete(
              `https://sierra-backend.onrender.com/messages/${otherUserId}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            Alert.alert("Chats Deleted", "All Chats have been erased.");
            navigation.goBack();
          },
        },
      ]
    );
  }

  const renderItem = ({ item, index }) => {
    const isCurrentUser = item.senderId === user._id;
    console.log(item.mediaURL);

    // Check if the current message is the first of a new day
    const showDateSeparator =
      index === 0 ||
      formatDate(sortedMessages[index].sentAt) !==
        formatDate(sortedMessages[index - 1].sentAt);

    return (
      <>
        {showDateSeparator && (
          <View style={styles.dateSeparator}>
            <Text style={styles.dateText}>{formatDate(item.sentAt)}</Text>
          </View>
        )}
        <View
          style={[
            styles.messageContainer,
            isCurrentUser ? styles.currentUserMessage : styles.receiverMessage,
          ]}
        >
          {!isCurrentUser && (
            <Image
              source={{ uri: receiver.profilePhoto }}
              style={styles.profileImage}
            />
          )}
          <View
            style={[
              styles.messageBubble,
              isCurrentUser && styles.currentUserBubble,
            ]}
          >
            {item.mediaURL &&
              ((item.mediaType === "image" && (
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("ViewImageScreen", {
                      mediaURL: item.mediaURL,
                    });
                  }}
                >
                  <Image
                    source={{ uri: item.mediaURL }}
                    style={styles.messageImage}
                  />
                </TouchableOpacity>
              )) ||
                (item.mediaType === "video" && (
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate("ViewVideoScreen", {
                        mediaURL: item.mediaURL,
                      });
                    }}
                    style={{ alignItems: "center", justifyContent: "center" }}
                  >
                    <Image
                      source={{
                        uri: thumbnails[item._id],
                      }}
                      style={styles.messageImage}
                    />
                    <Ionicons
                      name="play-circle"
                      size={40}
                      color="#fff"
                      style={{ position: "absolute" }}
                    />
                  </TouchableOpacity>
                )) ||
                (item.mediaType === "audio" && (
                  <AudioPlayer uri={item.mediaURL} />
                )))}
            {item.message && (
              <Text style={styles.messageText}>{item.message}</Text>
            )}
            {item.senderId !== user._id && !item.isRead && (
              <View style={styles.unreadMarker} />
            )}
            <Text style={styles.timestamp}>{formatTime(item.sentAt)}</Text>
          </View>
          {isCurrentUser && (
            <Image
              source={{ uri: user.profilePhoto }}
              style={styles.profileImage}
            />
          )}
        </View>
      </>
    );
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

  const handleGalleryPick = async () => {
    const permissionsResult = await getPermissions();
    if (!permissionsResult) {
      Alert.alert(
        "Permissions denied",
        "Permission to access image is required to proceed."
      );
      setShowPicker(false);
      return;
    }

    const galleryPick = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
      mediaTypes: ImagePicker.MediaTypeOptions.All,
    });

    if (!galleryPick.canceled) {
      if (galleryPick.assets[0].type === "image") {
        // select image file
        setSelectedImageUri(galleryPick.assets[0].uri);

        // deselect all others
        setSelectedVideoUri("");
        setSelectedAudioUri("");
      } else if (galleryPick.assets[0].type === "video") {
        // select video file
        setSelectedVideoUri(galleryPick.assets[0].uri);

        // deselect all other
        setSelectedAudioUri("");
        setSelectedImageUri("");

        setShowPicker(false);
        console.log(selectedVideoUri);
      }
    }
  };

  const handleAudioPick = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "audio/*",
      });
      if (result.canceled) return;
      console.log(result);

      // select audio file
      setSelectedAudioUri(result.assets[0].uri);
      setAudioName(result.assets[0].name);

      // deselect all other
      setSelectedImageUri("");
      setSelectedVideoUri("");

      setShowPicker(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSendMessage = async () => {
    if (
      newMessage.trim() ||
      selectedImageUri ||
      selectedVideoUri ||
      selectedAudioUri
    ) {
      setSendLoading(true);
      const formData = new FormData();
      formData.append("senderId", user._id);
      formData.append("receiverId", receiverId);
      formData.append("message", newMessage.trim());

      if (selectedImageUri) {
        const imageUri = selectedImageUri;
        const uriParts = imageUri.split(".");
        const fileType = uriParts[uriParts.length - 1];

        formData.append("mediaURL", {
          uri: imageUri,
          name: `photo.${fileType}`,
          type: `image/${fileType}`,
        });
        formData.append("mediaType", "image");
      } else if (selectedVideoUri) {
        const videoUri = selectedVideoUri;
        const uriParts = videoUri.split(".");
        const fileType = uriParts[uriParts.length - 1];

        formData.append("mediaURL", {
          uri: videoUri,
          type: `video/${fileType}`,
          name: `video.${fileType}`,
        });
        formData.append("mediaType", "video");
        console.log(formData);
      } else if (selectedAudioUri) {
        const audioUri = selectedAudioUri;
        const uriParts = audioUri.split(".");
        const fileType = uriParts[uriParts.length - 1];
        const mimeType = getAudioMimeType(fileType);
        console.log(mimeType);

        formData.append("mediaURL", {
          uri: audioUri,
          type: mimeType,
          name: `audio.${fileType}`,
        });
        formData.append("mediaType", "audio");
      }

      try {
        const response = await axios({
          method: "post",
          url: "https://sierra-backend.onrender.com/messages",
          data: formData,
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        console.log(response.data);
        setNewMessage(""); // Clear input after sending
        setSelectedImageUri("");
        setSelectedVideoUri("");
        setSelectedDocumentUri("");
        setSelectedAudioUri("");
      } catch (error) {
        console.error("Error sending message", error);
      } finally {
        setSendLoading(false);
      }
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Loading Chats...</Text>
      </View>
    );
  }

  return (
    <ImageBackground
      style={styles.container}
      source={require("../assets/chat-background.png")}
      resizeMode="contain"
    >
      <FlatList
        ref={flatListRef}
        data={sortedMessages}
        renderItem={renderItem}
        keyExtractor={(item) => item._id.toString()}
        contentContainerStyle={{ paddingBottom: 10 }}
        onContentSizeChange={() => {
          setTimeout(() => {
            flatListRef.current?.scrollToEnd({
              animated: true,
            });
          });
        }}
      />
      <View style={styles.bottomContainer}>
        {showPicker && (
          <View style={styles.picker}>
            <View style={styles.pickerOptionsContainer}>
              <TouchableOpacity
                style={styles.pickerOptions}
                onPress={handleAudioPick}
              >
                <Ionicons name="musical-notes" size={30} />
                <Text>Audio</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.pickerOptions}
                onPress={handleGalleryPick}
              >
                <Ionicons name="image" size={30} />
                <Text>Gallery</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        {selectedImageUri && (
          <View style={styles.previewImageContainer}>
            <View style={styles.previewImage}>
              <Image
                source={{ uri: selectedImageUri }}
                style={{ width: "100%", height: "100%", borderRadius: 8 }} // Add styles for preview image
              />
              <TouchableOpacity
                style={styles.previewImageCancel}
                onPress={() => {
                  setSelectedImageUri("");
                }}
              >
                <Text style={{ color: "#fff", fontWeight: "light" }}>✖</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        {selectedVideoUri && selectedVideoThumbnail && (
          <View style={styles.previewImageContainer}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("ViewVideoScreen", {
                  mediaURL: selectedVideoUri,
                })
              }
              style={styles.previewImage}
            >
              <Image
                source={{ uri: selectedVideoThumbnail }}
                style={{ width: "100%", height: "100%", borderRadius: 8 }}
              />
              <Ionicons
                name="play-circle"
                color="#fff"
                size={40}
                style={styles.previewPlayOutline}
              />
              <TouchableOpacity
                style={styles.previewImageCancel}
                onPress={() => setSelectedVideoUri("")}
              >
                <Text style={{ color: "#fff" }}>✖</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          </View>
        )}
        {selectedAudioUri && (
          <View style={styles.previewAudioContainer}>
            <View style={styles.previewAudio}>
              <Ionicons name="musical-notes" size={30} />
              <Text style={{ marginTop: 10, color: "#575757" }}>
                {audioName}
              </Text>
              <TouchableOpacity
                style={styles.previewImageCancel}
                onPress={() => {
                  setSelectedAudioUri("");
                }}
              >
                <Text style={{ color: "#fff", fontWeight: "light" }}>✖</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        <View style={styles.inputTextButton}>
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.textInput, { height: Math.max(inputHeight, 40) }]}
              placeholder="Type your message..."
              value={newMessage}
              onChangeText={setNewMessage}
              onContentSizeChange={(event) => {
                const newHeight = event.nativeEvent.contentSize.height;
                setInputHeight(Math.min(newHeight, 150));
              }}
              multiline
            />
            <TouchableOpacity
              style={{
                justifyContent: "center",
                alignItems: "center",
                marginHorizontal: 5,
              }}
              onPress={() => {
                setShowPicker((prevState) => !prevState);
              }}
            >
              <Ionicons name="ellipsis-vertical" size={20} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.sendButton}
            onPress={handleSendMessage}
            disabled={sendLoading}
          >
            {sendLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.sendButtonText}>
                <Ionicons name="arrow-forward" size={20} />
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#dfe5f7",
  },
  dateSeparator: {
    alignItems: "center",
    marginVertical: 10,
  },
  dateText: {
    backgroundColor: "#e0e0e0",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    color: "#555",
    fontSize: 14,
  },
  messageContainer: {
    flexDirection: "row",
    marginBottom: 15,
    alignItems: "flex-start",
  },
  currentUserMessage: {
    justifyContent: "flex-end",
    flexDirection: "row",
  },
  receiverMessage: {
    justifyContent: "flex-start",
    flexDirection: "row",
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: "hidden",
    marginHorizontal: 8,
  },
  messageBubble: {
    backgroundColor: "#e1e1e3",
    padding: 10,
    borderRadius: 15,
    maxWidth: "75%",
  },
  currentUserBubble: {
    backgroundColor: "#0078d4",
  },
  messageText: {
    color: "#000",
    fontSize: 16,
  },
  timestamp: {
    fontSize: 12,
    color: "#333",
    marginTop: 5,
    alignSelf: "flex-end",
  },
  bottomContainer: {
    alignItems: "center",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    backgroundColor: "#fff",
  },
  textInput: {
    flex: 1,
    maxHeight: 100,
    fontSize: 16,
    paddingRight: 15,
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: "#0078d4",
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
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
  headerButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginRight: 10,
  },
  unreadMarker: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "green", // Green marker for unread message
  },
  headerTitle: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitleUsername: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 10,
  },
  headerProfileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: "hidden",
  },
  messageImage: {
    maxWidth: "100%",
    minWidth: 200,
    height: 200,
    borderRadius: 10,
    marginBottom: 5,
  },
  previewImage: {
    width: 150,
    height: 150,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  previewImageContainer: {
    width: "100%",
    height: 200,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    borderRadius: 8,
  },
  inputTextButton: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  previewImageCancel: {
    position: "absolute",
    right: 0,
    backgroundColor: "#fc8d95",
    width: 30,
    height: 30,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    top: 0,
  },
  inputContainer: {
    flexDirection: "row",
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    paddingHorizontal: 15,
  },
  previewPlayOutline: {
    position: "absolute",
  },
  thumbnailPlay: {
    position: "absolute",
    top: "50%",
    left: "50%",
  },
  picker: {
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  pickerOptions: {
    backgroundColor: "#ccc",
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  pickerOptionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 50,
  },
  previewAudioContainer: {
    height: 200,
    width: "100%",
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  previewAudio: {
    height: 150,
    width: 150,
    borderRadius: 10,
    backgroundColor: "#ccc",
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ChatScreen;
