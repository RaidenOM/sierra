import { createContext } from "react";
import { addMessageToBackend, messages as initialMessages } from "../backend";
import { useState } from "react";

export const AppContext = createContext();

export function AppContextProvider({ children }) {
  const [currentUserId, setCurrentUserId] = useState(4);
  const [messages, setMessages] = useState(initialMessages);

  // Function to add a new message
  const addMessage = (newMessage) => {
    //update state to rerender
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    //update the backend
    addMessageToBackend(newMessage);
  };

  // Function to fetch messages between two users
  const fetchMessagesBetweenUsers = (userId1, userId2) => {
    return messages.filter(
      (message) =>
        (message.senderId === userId1 && message.receiverId === userId2) ||
        (message.senderId === userId2 && message.receiverId === userId1)
    );
  };

  return (
    <AppContext.Provider
      value={{ currentUserId, messages, addMessage, fetchMessagesBetweenUsers }}
    >
      {children}
    </AppContext.Provider>
  );
}
