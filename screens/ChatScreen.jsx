import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import {
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { ActivityIndicator, Alert, FlatList, View } from 'react-native';
import {
  Appbar,
  Divider,
  IconButton,
  List,
  Text,
  TextInput,
  useTheme,
} from 'react-native-paper';
import { AppContext } from '../store/app-context';
// import { format } from 'date-fns';

export default function ChatScreen() {
  const theme = useTheme();
  const { user, token } = useContext(AppContext);
  const route = useRoute();
  const { otherUserId } = route.params;
  const navigation = useNavigation();
  const [otherUser, setOtherUser] = useState();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [showPicker, setShowPicker] = useState(false);

  const textInputRef = useRef();
  const [pickerPostion, setPickerPostion] = useState({
    bottom: 0,
    right: 0,
  });

  console.log(pickerPostion);

  useLayoutEffect(() => {
    if (textInputRef)
      console.log(
        textInputRef.current.measure((x, y, width, height, pageX, pageY) => {
          setPickerPostion({
            right: x,
            bottom: y + height + 8,
          });
        }),
      );
  }, []);
  // const formatDate = date => {
  //   return format(date, 'EEE, MMMM dd, yyyy');
  // };

  useLayoutEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(
          `https://sierra-backend.onrender.com/messages/${otherUserId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        console.log(response.data);
        setMessages(response.data);
      } catch (error) {
        const errorMessage =
          error.response?.data?.message || 'An error occured';
        Alert.alert('Error', errorMessage);
      }
    };

    const fetchOtherUser = async () => {
      try {
        const response = await axios.get(
          `https://sierra-backend.onrender.com/users/${otherUserId}`,
        );
        setOtherUser(response.data);
        navigation.setOptions({ headerTitle: response.data.username });
        await fetchMessages();
      } catch (error) {
        const errorMessage =
          error.response?.data?.message || 'An error occured';
        Alert.alert('Error', errorMessage);
      } finally {
        setLoading(false);
      }
    };

    if (otherUserId) fetchOtherUser();
  }, [otherUserId]);

  const renderMessage = ({ item, index }) => {
    const showDateSeparator = true;

    return (
      <>
        {showDateSeparator && (
          <View style={{ alignItems: 'center', marginVertical: 10 }}>
            <Text
              style={{
                backgroundColor: theme.colors.surfaceVariant,
                paddingHorizontal: 10,
                paddingVertical: 5,
                borderRadius: 12,
                color: theme.colors.onSurfaceVariant,
                fontSize: 14,
                overflow: 'hidden',
              }}
            >
              {item.sentAt}
            </Text>
          </View>
        )}
        <View
          style={{
            flexDirection: 'row',
            justifyContent:
              item.senderId._id === user._id ? 'flex-end' : 'flex-start',
            marginBottom: 12,
          }}
        >
          <View
            style={{
              backgroundColor: theme.colors.primary,
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 12,
              [item.senderId._id === user._id
                ? 'marginLeft'
                : 'marginRight']: 50,
            }}
          >
            <Text
              style={{ color: theme.colors.onPrimary }}
              variant="bodyMedium"
            >
              {item.message}
            </Text>
          </View>
        </View>
      </>
    );
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.dark ? '#000' : theme.colors.background,
      }}
    >
      <View style={{ flex: 1 }}>
        {loading ? (
          <View
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
          >
            <ActivityIndicator color={theme.colors.onBackground} />
            <Text variant="bodyMedium" style={{ marginTop: 8 }}>
              Loading chats...
            </Text>
          </View>
        ) : (
          <FlatList
            data={messages}
            renderItem={renderMessage}
            keyExtractor={item => item._id}
            contentContainerStyle={{ padding: 12 }}
          />
        )}
      </View>
      <View>
        {showPicker && (
          <View
            style={{
              backgroundColor: theme.dark
                ? theme.colors.surface
                : theme.colors.elevation.level5,
              position: 'relative',
              alignSelf: 'center',
              position: 'absolute',
              bottom: pickerPostion.bottom,
              right: pickerPostion.right,
              borderRadius: 12,
              paddingHorizontal: 12,
              paddingVertical: 8,
            }}
          >
            <List.Item
              title="Music"
              left={() => (
                <List.Icon
                  icon={'music'}
                  iconColor={theme.colors.primary}
                  mode="outlined"
                />
              )}
            />
            <Divider />
            <List.Item
              title="Gallery"
              left={() => (
                <List.Icon
                  icon={'image-multiple'}
                  iconColor={theme.colors.primary}
                  mode="outlined"
                />
              )}
            />
            {/* <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                flex: 1,
              }}
            >
              <View>
                <IconButton
                  icon={'music'}
                  iconColor={theme.colors.primary}
                  mode="outlined"
                />
              </View>
              <View>
                <IconButton
                  icon={'image-multiple'}
                  iconColor={theme.colors.primary}
                  mode="outlined"
                />
              </View>
            </View> */}
          </View>
        )}
        <View
          style={{
            paddingVertical: 4,
            backgroundColor: theme.dark
              ? theme.colors.surface
              : theme.colors.elevation.level1,
            flexDirection: 'row',
          }}
        >
          <IconButton icon="emoticon-outline" />
          <View ref={textInputRef} style={{ flex: 1 }}>
            <TextInput
              value={message}
              onChangeText={setMessage}
              placeholder="Type something..."
              right={
                <TextInput.Icon
                  icon="paperclip-plus"
                  onPress={() => setShowPicker(prevState => !prevState)}
                />
              }
            />
          </View>
          <IconButton icon="send" />
        </View>
      </View>
    </View>
  );
}
