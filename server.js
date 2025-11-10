
const express = require('express');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(cors());
const server = http.createServer(app);

// Initialize Socket.IO server, allowing connections from any origin for simple hosting.
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 3000;

// --- Serve all frontend files ---
// This single line makes your entire project folder (where this server.js is) accessible.
// When a browser visits the main URL, it will automatically find and serve 'index.html'.
app.use(express.static(__dirname));

// --- In-memory store for chat messages and activity logs ---
const messages = [];
const activityLog = [];

// --- WebSocket Connection Handling ---
io.on('connection', (socket) => {
  const nickname = socket.handshake.query.nickname || 'Anonymous';
  console.log(`User connected: ${nickname} (${socket.id})`);
  activityLog.push({ type: 'USER_JOIN', nickname, timestamp: new Date().toISOString(), socketId: socket.id });

  // Send chat history to the newly connected client
  socket.emit('history', messages);

  // Broadcast a system message that a new user has joined
  const joinMessage = {
    id: uuidv4(),
    type: 'SYSTEM',
    nickname: 'System',
    message: `${nickname} has joined the chat.`,
    timestamp: new Date().toISOString(),
  };
  messages.push(joinMessage);
  io.emit('newRecord', joinMessage);

  // Listen for new messages from a client
  socket.on('sendMessage', (message) => {
    console.log(`Message from ${nickname}: ${message}`);
    activityLog.push({ type: 'MESSAGE_SENT', nickname, message, timestamp: new Date().toISOString() });
    const newRecord = {
      id: uuidv4(),
      type: 'USER',
      nickname: nickname,
      message: message,
      timestamp: new Date().toISOString(),
    };
    messages.push(newRecord);
    io.emit('newRecord', newRecord);
  });

  // Listen for log requests from a client
  socket.on('getLogs', () => {
    socket.emit('logsData', activityLog);
  });

  // Handle client disconnection
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${nickname} (${socket.id})`);
    activityLog.push({ type: 'USER_LEAVE', nickname, timestamp: new Date().toISOString(), socketId: socket.id });
    const leaveMessage = {
      id: uuidv4(),
      type: 'SYSTEM',
      nickname: 'System',
      message: `${nickname} has left the chat.`,
      timestamp: new Date().toISOString(),
    };
    messages.push(leaveMessage);
    io.emit('newRecord', leaveMessage);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
