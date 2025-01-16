const users = [
  {
    id: 1,
    username: "user1",
    profilePhoto: "https://randomuser.me/api/portraits/men/1.jpg",
    bio: "Coder",
  },
  {
    id: 2,
    username: "user2",
    profilePhoto: "https://randomuser.me/api/portraits/men/2.jpg",
    bio: "Painter",
  },
  {
    id: 3,
    username: "user3",
    profilePhoto: "https://randomuser.me/api/portraits/men/3.jpg",
    bio: "Reader",
  },
  {
    id: 4,
    username: "user4",
    profilePhoto: "https://randomuser.me/api/portraits/men/4.jpg",
    bio: "Farmer",
  },
  {
    id: 5,
    username: "user5",
    profilePhoto: "https://randomuser.me/api/portraits/men/5.jpg",
    bio: "Gamer",
  },
];

const messages = [
  {
    id: 1,
    senderId: 1,
    receiverId: 3,
    message: "Hello, how are you?",
    sentAt: "2025-01-16T09:00:00Z",
  },
  {
    id: 2,
    senderId: 3,
    receiverId: 1,
    message: "I'm doing great! How about you?",
    sentAt: "2025-01-16T09:05:00Z",
  },
  {
    id: 3,
    senderId: 2,
    receiverId: 5,
    message: "Hey, want to join me for a game later?",
    sentAt: "2025-01-16T10:00:00Z",
  },
  {
    id: 4,
    senderId: 5,
    receiverId: 2,
    message: "Sure, sounds fun! What game do you have in mind?",
    sentAt: "2025-01-16T10:05:00Z",
  },
  {
    id: 5,
    senderId: 4,
    receiverId: 1,
    message: "Hey, can you help me with some code for a project?",
    sentAt: "2025-01-16T11:00:00Z",
  },
  {
    id: 6,
    senderId: 1,
    receiverId: 4,
    message: "I'd be happy to help! What specifically do you need?",
    sentAt: "2025-01-16T11:10:00Z",
  },
  {
    id: 7,
    senderId: 3,
    receiverId: 4,
    message:
      "I love reading about farming techniques, can you share some resources?",
    sentAt: "2025-01-16T12:00:00Z",
  },
  {
    id: 8,
    senderId: 4,
    receiverId: 3,
    message: "Sure! I'll send you some links later.",
    sentAt: "2025-01-16T12:15:00Z",
  },
  {
    id: 9,
    senderId: 5,
    receiverId: 2,
    message: "How about we play something new tonight?",
    sentAt: "2025-01-16T12:30:00Z",
  },
  {
    id: 10,
    senderId: 2,
    receiverId: 5,
    message: "That sounds awesome! What did you have in mind?",
    sentAt: "2025-01-16T12:45:00Z",
  },
];

const addMessageToBackend = (message) => {
  messages.push(message);
};

//Async device storage
const contacts = [{ userId: 1 }, { userId: 3 }, { userId: 5 }, { userId: 2 }];

export { users, messages, contacts, addMessageToBackend };
