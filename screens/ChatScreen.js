import { useContext, useState, useEffect, useLayoutEffect } from "react";
import {
  Text,
  View,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ImageBackground,
  Keyboard,
} from "react-native";
import {
  useIsFocused,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import axios from "axios";
import { UserContext } from "../store/app-context";
import { useRef } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { format } from "date-fns";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import { getThumbnailAsync } from "expo-video-thumbnails";
import AudioPlayer from "../components/AudioPlayer";
import { LinearGradient } from "expo-linear-gradient";
import EmojiSelector from "react-native-emoji-selector";
import CustomInput from "../components/CustomInput";
import { ChatContext } from "../store/chat-context";
import * as Progress from "react-native-progress";

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
  const { user, socket, token, typingUsers, playMessageSentSound, theme } =
    useContext(UserContext);
  const { setChats } = useContext(ChatContext);
  const [sendLoading, setSendLoading] = useState(false);
  const { receiverId } = route.params;
  const [thumbnails, setThumbnails] = useState({});
  const [showPicker, setShowPicker] = useState(false);
  const [audioName, setAudioName] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [receiver, setReceiver] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedImageUri, setSelectedImageUri] = useState("");
  const [selectedVideoUri, setSelectedVideoUri] = useState("");
  const [selectedVideoThumbnail, setSelectedVideoThumbnail] = useState("");
  const [selectedAudioUri, setSelectedAudioUri] = useState("");
  const [cameraPermissionInfo, requestPermission] =
    ImagePicker.useCameraPermissions();
  const isFocused = useIsFocused();
  const [currentPlayingSound, setCurrentPlayingSound] = useState(null);
  const [isTyping, setIsTyping] = useState(false);

  const flatListRef = useRef(null);

  const isDarkTheme = theme === "dark";

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
      } catch (error) {
        console.error("Error fetching messages", error);
      } finally {
        setLoading(false);
      }
    }

    if (receiver) {
      fetchMessages();
    }
  }, [token, receiverId, receiver]);

  // bind handler to handler emits from server
  useEffect(() => {
    const handleNewMessage = (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    };

    socket.on("new-message", handleNewMessage);

    return () => {
      socket.off("new-message", handleNewMessage);
    };
  }, [socket]);

  // bind handler to handler emits from server
  useEffect(() => {
    socket.on("message-sent", (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setChats((prevChats) => {
        const updatedChats = [...prevChats];
        const indexToBeUpdated = updatedChats.findIndex(
          (chat) =>
            chat.senderId._id === receiverId ||
            chat.receiverId._id === receiverId
        );
        if (indexToBeUpdated >= 0) {
          updatedChats.splice(indexToBeUpdated, 1);
        }
        updatedChats.unshift(newMessage);
        return updatedChats;
      });
    });

    return () => {
      socket.off("message-sent");
    };
  }, [socket]);

  // useEffect to mark messages as read between current user and other user on screen exit
  useEffect(() => {
    const markAsRead = async () => {
      await axios.put(
        `https://sierra-backend.onrender.com/messages/mark-read/${receiverId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setChats((prevChats) => {
        return prevChats.map((chat) =>
          chat.senderId._id === receiverId
            ? { ...chat, isRead: true, unreadCount: 0 }
            : chat
        );
      });
    };

    if (!isFocused) markAsRead();
  }, [messages, receiverId, token, isFocused]);

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
              source={
                receiver.profilePhoto
                  ? { uri: receiver.profilePhoto }
                  : require("../assets/image/user.png")
              }
              style={styles.headerProfileImage}
            />
            <View style={styles.headerTitleContainer}>
              <Text style={styles.headerTitleUsername}>
                {receiver.username}
              </Text>
              <Text style={{ color: "#00fa57", marginLeft: 10 }}>
                {!!typingUsers[receiverId] && "typing..."}
              </Text>
            </View>
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
            <Ionicons name="trash" size={25} color={tintColor} />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [receiver, typingUsers]);

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

  // typing indicator logic
  useEffect(() => {
    if (isTyping) {
      socket.emit("typing", {
        senderId: user._id,
        receiverId: receiverId,
      });

      const timeout = setTimeout(() => {
        socket.emit("stop-typing", {
          senderId: user._id,
          receiverId: receiverId,
        });
        setIsTyping(false);
      }, 3000);

      return () => clearTimeout(timeout);
    }
  }, [isTyping, socket, user._id, receiverId]);

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
    const isCurrentUser = item.senderId._id === user._id;

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
              source={
                receiver.profilePhoto
                  ? { uri: receiver.profilePhoto }
                  : require("../assets/image/user.png")
              }
              style={styles.profileImage}
            />
          )}
          <View
            style={[
              styles.messageBubble,
              { backgroundColor: isDarkTheme ? "rgb(30,30,30)" : "#ccc" },
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
                  <AudioPlayer
                    uri={item.mediaURL}
                    setCurrentPlayingSound={setCurrentPlayingSound}
                    currentPlayingSound={currentPlayingSound}
                  />
                )))}
            {item.message && (
              <Text
                style={[
                  styles.messageText,
                  { color: !isDarkTheme ? "black" : "white" },
                ]}
              >
                {item.message}
              </Text>
            )}
            {item.senderId._id !== user._id && !item.isRead && (
              <View style={styles.unreadMarker} />
            )}
            <Text
              style={[
                styles.timestamp,
                { color: isDarkTheme ? "#EAEAEA" : "#333" },
              ]}
            >
              {formatTime(item.sentAt)}
            </Text>
          </View>
          {isCurrentUser && (
            <Image
              source={
                user.profilePhoto
                  ? { uri: user.profilePhoto }
                  : require("../assets/image/user.png")
              }
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
      }
      setShowPicker(false);
    }
  };

  const handleAudioPick = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "audio/*",
      });
      if (result.canceled) return;

      // select audio file
      setSelectedAudioUri(result.assets[0].uri);
      setAudioName(result.assets[0].name);

      // deselect all other
      setSelectedImageUri("");
      setSelectedVideoUri("");
    } catch (error) {
      console.log(error);
    } finally {
      setShowPicker(false);
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
      } else if (selectedAudioUri) {
        const audioUri = selectedAudioUri;
        const uriParts = audioUri.split(".");
        const fileType = uriParts[uriParts.length - 1];
        const mimeType = getAudioMimeType(fileType);

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
          onUploadProgress: (progressData) => {
            setUploadProgress(
              (progressData.loaded / progressData.loaded) * 100
            );
          },
        });
        setNewMessage("");
        setSelectedImageUri("");
        setSelectedVideoUri("");
        setSelectedAudioUri("");

        await playMessageSentSound();
      } catch (error) {
        console.error("Error sending message", error);
      } finally {
        setSendLoading(false);
        setUploadProgress(0);
      }
    }
  };

  function renderContent() {
    const content = (
      <>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4CAF50" />
            <Text style={styles.loadingText}>Loading Chats...</Text>
          </View>
        ) : (
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
        )}

        <View
          style={[
            styles.bottomContainer,
            { backgroundColor: isDarkTheme ? "rgb(30,30,30)" : "#fff" },
          ]}
        >
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
                  style={{ width: "100%", height: "100%", borderRadius: 8 }}
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
            <TouchableOpacity
              style={{
                justifyContent: "center",
                alignItems: "center",
                marginRight: 10,
              }}
              onPress={() => {
                setShowEmojiPicker(!showEmojiPicker);
                Keyboard.dismiss();
              }}
            >
              <Ionicons name="happy-outline" size={30} color="#6993ff" />
            </TouchableOpacity>
            <View style={styles.inputContainer}>
              <CustomInput
                style={[
                  styles.textInput,
                  {
                    color: isDarkTheme ? "white" : "black",
                  },
                ]}
                placeholderTextColor={"#7f8c8d"}
                placeholder="Type your message..."
                value={newMessage}
                onChangeText={(newText) => {
                  setNewMessage(newText);
                  if (!isTyping) {
                    setIsTyping(true);
                  }
                }}
                onFocus={() => setShowEmojiPicker(false)}
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
                  setSelectedImageUri("");
                  setSelectedVideoUri("");
                  setSelectedAudioUri("");
                }}
              >
                <Ionicons
                  name="ellipsis-vertical"
                  size={20}
                  color={isDarkTheme ? "white" : "black"}
                />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.sendButton}
              onPress={handleSendMessage}
              disabled={sendLoading}
            >
              {sendLoading ? (
                <Progress.Circle
                  progress={uploadProgress / 100}
                  color="#0f0"
                  borderWidth={0}
                />
              ) : (
                <Text style={styles.sendButtonText}>
                  <Ionicons name="send" size={20} />
                </Text>
              )}
            </TouchableOpacity>
          </View>
          {showEmojiPicker && (
            <EmojiSelector
              onEmojiSelected={(emoji) => {
                setNewMessage((prevMessage) => prevMessage + emoji);
              }}
              style={styles.emojiPicker}
              showHistory={true}
              showSearchBar={false}
            />
          )}
        </View>
      </>
    );

    return (
      <>
        {isDarkTheme ? (
          <View style={{ flex: 1 }}>{content}</View>
        ) : (
          <ImageBackground
            style={{ flex: 1 }}
            source={require("../assets/chat-background.png")}
            resizeMode="contain"
          >
            {content}
          </ImageBackground>
        )}
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
  },
  dateSeparator: {
    alignItems: "center",
    marginVertical: 10,
  },
  dateText: {
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    color: "#555",
    fontSize: 14,
    overflow: "hidden",
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
    backgroundColor: "#1e1e1c",
    padding: 10,
    borderRadius: 15,
    maxWidth: "75%",
  },
  currentUserBubble: {
    backgroundColor: "#6993ff",
  },
  messageText: {
    fontSize: 16,
  },
  timestamp: {
    fontSize: 12,
    marginTop: 5,
    alignSelf: "flex-end",
  },
  bottomContainer: {
    alignItems: "center",
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
  },
  textInput: {
    flex: 1,
    maxHeight: 100,
    paddingHorizontal: 0,
    borderWidth: 0,
    borderRadius: 0,
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: "#6993ff",
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
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#7f8c8d",
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
    backgroundColor: "green",
  },
  headerTitle: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitleUsername: {
    fontFamily: "Orbitron_400Regular",
    fontSize: 20,
    color: "#6993ff",
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
  headerTitleContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
    flexDirection: "row",
  },
  emojiPicker: {
    height: 250,
  },
});

export default ChatScreen;
