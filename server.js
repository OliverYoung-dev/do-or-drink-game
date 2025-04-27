const express = require('express');
const http = require('http');
const { Server } = require('socket.io'); // Notice: use { Server } for CORS config

// Create an express app and an HTTP server
const app = express();
const server = http.createServer(app);

// Setup Socket.IO with CORS allowed
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins (or restrict to your frontend domain if you want)
    methods: ["GET", "POST"]
  }
});

// Store room data  
const rooms = {};

// Serve the React app (your frontend build folder if needed)
app.use(express.static('build'));   


// Add a basic route for testing (important for Render uptime checks)
app.get("/", (req, res) => {
  res.send("Server is up and running 🚀");
});

// Handle Socket.io connections
io.on('connection', (socket) => {
  console.log('🔌 A user connected');

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
  socket.on('join-room', (roomCode) => {
    if (!rooms[roomCode]) {
      socket.emit('error', 'Room does not exist!');
      return;
    }

    rooms[roomCode].players.push(socket.id);
    socket.join(roomCode);
    io.to(roomCode).emit('player-joined', rooms[roomCode].players);

    // Check if the room has enough players to start the game
    if (rooms[roomCode].players.length >= 2) {
      io.to(roomCode).emit('start-game');
    }
  });

  // Handle disconnections
  socket.on('disconnect', () => {
    for (const roomCode in rooms) {
      const room = rooms[roomCode];
      room.players = room.players.filter(playerId => playerId !== socket.id);
      io.to(roomCode).emit('player-left', room.players);

      if (room.players.length === 0) {
        delete rooms[roomCode]; // Clean up empty rooms
      }
    }
    console.log('❌ A user disconnected');
    
  });
});

// Start the server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
