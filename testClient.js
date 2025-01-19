const { io } = require("socket.io-client");

// Replace with your backend server's IP and port
const socket = io("http://192.168.31.6:3000", {
  transports: ["websocket"],
});

socket.on("connect", () => {
  console.log("Connected to server with socket ID:", socket.id);

  // Join a room for testing
  socket.emit("join-room", "test-room");
});

socket.on("new-message", (data) => {
  console.log("Received new message:", data);
});

socket.on("message-sent", (data) => {
  console.log("Message sent confirmation:", data);
});

socket.on("disconnect", () => {
  console.log("Disconnected from server.");
});

socket.on("connect_error", (err) => {
  console.error("Connection error:", err.message);
});
