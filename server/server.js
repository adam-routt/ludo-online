/*
app.get("/api", (req, res) => {
    res.json({"users": ["userOne", "userTwo", "userThree"]})
})
*/
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const { v4: uuidv4 } = require('uuid'); // for generating unique lobby codes

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let lobbies = {};

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // Handle lobby creation
  socket.on('createLobby', ({ lobbyName, username, isPublic }, callback) => {
    const lobbyCode = generateLobbyCode();
    lobbies[lobbyCode] = {
      lobbyName,
      isPublic,
      users: [{ username, socketId: socket.id }],
      createdAt: Date.now(),
    };
    socket.join(lobbyCode);
    callback(lobbyCode);
  });

  // Handle lobby joining
  socket.on('joinLobby', ({ lobbyCode, username }, callback) => {
    const lobby = lobbies[lobbyCode];
    if (lobby) {
      lobby.users.push({ username, socketId: socket.id });
      socket.join(lobbyCode);
      io.to(lobbyCode).emit('lobbyUpdated', lobby);
      callback(lobby);
    } else {
      callback(null);
    }
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    // Find and remove user from lobby
    for (const [code, lobby] of Object.entries(lobbies)) {
      lobby.users = lobby.users.filter(user => user.socketId !== socket.id);
      if (lobby.users.length === 0) {
        delete lobbies[code]; // Close lobby if no users are left
      } else {
        io.to(code).emit('lobbyUpdated', lobby);
      }
    }
  });
});

const generateLobbyCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  for (let i = 0; i < 4; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

const port = process.env.PORT || 4000;
server.listen(port, () => console.log(`Listening on port ${port}`));