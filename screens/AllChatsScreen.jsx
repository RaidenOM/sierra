import { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import {
  Avatar,
  Badge,
  Button,
  Icon,
  List,
  Text,
  useTheme,
} from 'react-native-paper';
import { ActivityIndicator } from 'react-native';
import { AppContext } from '../store/app-context';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

export default function AllChatsScreen() {
  const [chats, setChats] = useState([]);
  const { user, token } = useContext(AppContext);
  const [chatsLoading, setChatsLoading] = useState(true);
  const theme = useTheme();
  const navigation = useNavigation();

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await axios.get(
          'https://sierra-backend.onrender.com/latest-messages',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        console.log(response.data);
        setChats(response.data);
      } catch (error) {
        const errorMessage =
          error.response?.data?.message || 'An error occured';
        Alert.alert('Error', errorMessage);
      } finally {
        setChatsLoading(false);
      }
    };

    fetchChats();
  }, []);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.dark ? '#000' : theme.colors.background,
      }}
    >
      <Text
        variant="displaySmall"
        style={{
          marginTop: 20,
          fontFamily: 'Poppins-ExtraLight',
          marginHorizontal: 16,
        }}
      >
        Chats
      </Text>
      {chatsLoading ? (
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
          data={chats}
          renderItem={({ item }) => {
            const otherUser =
              item.senderId._id === user._id ? item.receiverId : item.senderId;
            return (
              <List.Item
                onPress={() => {
                  navigation.navigate('ChatScreen', {
                    otherUserId: otherUser._id,
                  });
                }}
                title={otherUser.username}
                description={({ color, fontSize }) => (
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Icon
                      source={
                        item.senderId._id === user._id
                          ? 'arrow-left'
                          : 'arrow-right'
                      }
                    />
                    <Text
                      style={{
                        fontSize: fontSize,
                        color: color,
                        paddingRight: 16,
                      }}
                      numberOfLines={1}
                    >
                      {' ' + item.message}
                    </Text>
                  </View>
                )}
                left={() => (
                  <Avatar.Image
                    source={
                      otherUser.profilePhoto
                        ? { uri: otherUser.profilePhoto }
                        : require('../assets/images/user.png')
                    }
                  />
                )}
                right={() =>
                  item.unreadCount !== 0 && (
                    <Badge style={{ alignSelf: 'center' }}>
                      {item.unreadCount}
                    </Badge>
                  )
                }
              />
            );
          }}
          keyExtractor={item => item._id}
          contentContainerStyle={{ paddingHorizontal: 16 }}
        />
      )}
    </View>
  );
}
