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

let messages = [
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
    message: "I love reading about farming techniques, can you share some resources?",
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

// Fixed contacts structure - consistent with users.id
const contacts = [{ id: 1 }, { id: 3 }, { id: 5 }, { id: 2 }];

// Input validation helper
const validateMessage = (message) => {
  const errors = [];
  
  if (!message.senderId || typeof message.senderId !== 'number') {
    errors.push('Invalid senderId');
  }
  
  if (!message.receiverId || typeof message.receiverId !== 'number') {
    errors.push('Invalid receiverId');
  }
  
  if (!message.message || typeof message.message !== 'string' || message.message.trim().length === 0) {
    errors.push('Message content is required');
  }
  
  // Check if users exist
  if (!users.find(u => u.id === message.senderId)) {
    errors.push('Sender does not exist');
  }
  
  if (!users.find(u => u.id === message.receiverId)) {
    errors.push('Receiver does not exist');
  }
  
  return errors;
};

// Sanitize message content
const sanitizeMessage = (message) => {
  return message.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                .replace(/<[^>]*>?/gm, '')
                .trim();
};

// Generate unique ID with better collision resistance
let messageIdCounter = Math.max(...messages.map(m => m.id), 0) + 1;

const generateMessageId = () => {
  return messageIdCounter++;
};

// Fixed addMessageToBackend with proper error handling and validation
const addMessageToBackend = (messageData) => {
  try {
    // Validate input
    const validationErrors = validateMessage(messageData);
    if (validationErrors.length > 0) {
      throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
    }
    
    // Sanitize message content
    const sanitizedMessage = sanitizeMessage(messageData.message);
    
    // Create new message with generated ID and timestamp
    const newMessage = {
      id: generateMessageId(),
      senderId: messageData.senderId,
      receiverId: messageData.receiverId,
      message: sanitizedMessage,
      sentAt: new Date().toISOString()
    };
    
    // Add to messages array
    messages.push(newMessage);
    
    // Optional: Implement message limit to prevent memory issues
    const MAX_MESSAGES = 10000;
    if (messages.length > MAX_MESSAGES) {
      messages = messages.slice(-MAX_MESSAGES);
    }
    
    return { success: true, message: newMessage };
    
  } catch (error) {
    console.error('Error adding message:', error);
    return { success: false, error: error.message };
  }
};

// Additional helper functions
const getMessagesBetweenUsers = (userId1, userId2) => {
  return messages
    .filter(msg => 
      (msg.senderId === userId1 && msg.receiverId === userId2) ||
      (msg.senderId === userId2 && msg.receiverId === userId1)
    )
    .sort((a, b) => new Date(a.sentAt) - new Date(b.sentAt));
};

const getUserById = (id) => {
  return users.find(user => user.id === id);
};

const getContactsForUser = (userId) => {
  return contacts
    .filter(contact => contact.id !== userId)
    .map(contact => getUserById(contact.id))
    .filter(Boolean);
};

export { 
  users, 
  messages, 
  contacts, 
  addMessageToBackend,
  getMessagesBetweenUsers,
  getUserById,
  getContactsForUser
};
