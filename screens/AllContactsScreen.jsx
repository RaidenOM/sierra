import { useContext, useState } from 'react';
import { View, FlatList, ActivityIndicator } from 'react-native';
import { Avatar, List, Text, useTheme } from 'react-native-paper';
import { AppContext } from '../store/app-context';

const data = [
  {
    username: 'John Hoe',
    savedName: 'Johnny',
    bio: 'Coffee lover ☕ | React Native dev',
    profilePhoto: 'https://randomuser.me/api/portraits/men/65.jpg',
  },
  {
    username: 'Emily Carter',
    savedName: 'Em',
    bio: 'Bookworm & yoga enthusiast',
    profilePhoto: 'https://randomuser.me/api/portraits/women/12.jpg',
  },
  {
    username: 'Michael Lee',
    savedName: 'Michael',
    bio: 'Fullstack developer | Gamer',
    profilePhoto: 'https://randomuser.me/api/portraits/men/33.jpg',
  },
  {
    username: 'Sarah Wilson',
    savedName: 'Sarah W.',
    bio: 'Photographer & traveler',
    profilePhoto: 'https://randomuser.me/api/portraits/women/44.jpg',
  },
  {
    username: 'Daniel Park',
    savedName: 'Daniel',
    bio: 'Music producer and tech geek',
    profilePhoto: 'https://randomuser.me/api/portraits/men/18.jpg',
  },
  {
    username: 'Ava Mitchell',
    savedName: 'Aves',
    bio: 'Fitness coach | Vegan 🌱',
    profilePhoto: 'https://randomuser.me/api/portraits/women/56.jpg',
  },
  {
    username: 'Chris Nolan',
    savedName: 'Chris',
    bio: 'Movie lover & blogger',
    profilePhoto: 'https://randomuser.me/api/portraits/men/27.jpg',
  },
  {
    username: 'Olivia Brown',
    savedName: 'Liv',
    bio: 'Designer | Coffee addict',
    profilePhoto: 'https://randomuser.me/api/portraits/women/8.jpg',
  },
  {
    username: 'Ethan Young',
    savedName: 'Ethan',
    bio: 'Tech enthusiast | Basketball fan',
    profilePhoto: 'https://randomuser.me/api/portraits/men/72.jpg',
  },
  {
    username: 'Sophia Jones',
    savedName: 'Sophie',
    bio: 'Travel blogger & foodie 🍣',
    profilePhoto: 'https://randomuser.me/api/portraits/women/32.jpg',
  },
  {
    username: 'Jacob Miller',
    savedName: 'Jacob',
    bio: 'Entrepreneur | Startup life',
    profilePhoto: 'https://randomuser.me/api/portraits/men/51.jpg',
  },
  {
    username: 'Mia Thompson',
    savedName: 'Mimi',
    bio: 'Fashion designer & painter',
    profilePhoto: 'https://randomuser.me/api/portraits/women/67.jpg',
  },
  {
    username: 'William Scott',
    savedName: 'Will',
    bio: 'Coder | Guitar player 🎸',
    profilePhoto: 'https://randomuser.me/api/portraits/men/49.jpg',
  },
  {
    username: 'Ella Davis',
    savedName: 'Ella',
    bio: 'Digital artist | Cat lover 🐱',
    profilePhoto: 'https://randomuser.me/api/portraits/women/21.jpg',
  },
  {
    username: 'Liam Martinez',
    savedName: 'Lee',
    bio: 'Sports fan | Amateur chef',
    profilePhoto: 'https://randomuser.me/api/portraits/men/14.jpg',
  },
];

export default function AllContactsScreen() {
  const { logout } = useContext(AppContext);
  const [contactsLoading, setContactsLoading] = useState(false);
  const theme = useTheme();

  console.log(require('../assets/images/user.png'));

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
        Contacts
      </Text>
      {contactsLoading ? (
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <ActivityIndicator color={theme.colors.onBackground} />
          <Text variant="bodyMedium" style={{ marginTop: 8 }}>
            Loading contacts...
          </Text>
        </View>
      ) : (
        <FlatList
          data={data}
          renderItem={({ item }) => (
            <List.Item
              title={item.username + ' (' + item.savedName + ')'}
              description={({ color, fontSize }) => (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={{ fontSize: fontSize, color: color }}>
                    {item.bio}
                  </Text>
                </View>
              )}
              left={() => (
                <Avatar.Image
                  source={
                    item.profilePhoto
                      ? { uri: item.profilePhoto }
                      : require('../assets/images/user.png')
                  }
                />
              )}
            />
          )}
          keyExtractor={({ username }) => username}
          contentContainerStyle={{ paddingHorizontal: 16 }}
        />
      )}
    </View>
  );
}
