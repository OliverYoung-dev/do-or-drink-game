const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

// Setup Socket.IO with CORS allowed
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Store room data
const rooms = {};

// Serve static files if needed
app.use(express.static('build'));

// Basic health check route
app.get("/", (req, res) => {
  res.send("Server is up and running 🚀");
});

// Handle socket connections
io.on('connection', (socket) => {
  console.log('🔌 A user connected:', socket.id);

  // Handle creating a room
  socket.on('create-room', (roomCode) => {
    if (rooms[roomCode]) {
      socket.emit('error', 'Room already exists!');
      return;
    }
    rooms[roomCode] = { players: [] };
    socket.join(roomCode);
    io.to(roomCode).emit('room-created', roomCode);
    console.log(`🛖 Room created: ${roomCode}`);
  });

  // Handle joining a room
  socket.on('join-room', (roomCode, deviceName) => {
    if (!rooms[roomCode]) {
      socket.emit('error', 'Room does not exist!');
      return;
    }

    rooms[roomCode].players.push({
      id: socket.id,
      name: deviceName || "Unknown Player",
    });

    socket.join(roomCode);
    console.log(`🙋 Player joined room ${roomCode}: ${deviceName}`);

    // Send updated players list
    const playerNames = rooms[roomCode].players.map(player => player.name);
    io.to(roomCode).emit('player-joined', playerNames);
  });

  // Handle manually starting the game
  socket.on('start-game', (roomCode) => {
    if (!rooms[roomCode]) {
      socket.emit('error', 'Room not found.');
      return;
    }
    io.to(roomCode).emit('start-game');
    console.log(`🎮 Game started in room: ${roomCode}`);
  });

  // Handle disconnections
  socket.on('disconnect', () => {
    console.log('❌ A user disconnected:', socket.id);

    for (const roomCode in rooms) {
      const room = rooms[roomCode];

      // Remove the player from the room
      room.players = room.players.filter(player => player.id !== socket.id);

      // Notify others in the room
      const playerNames = room.players.map(player => player.name);
      io.to(roomCode).emit('player-joined', playerNames);

      // If room is empty, delete it
      if (room.players.length === 0) {
        delete rooms[roomCode];
        console.log(`🧹 Room ${roomCode} deleted (empty)`);
      }
    }
  });
});

// Start the server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
