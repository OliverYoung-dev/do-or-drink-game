import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { io } from "socket.io-client";
import OnlineDares from "./OnlineDares";

export default function OnlineLobby({ onBack, theme }) {
  const [mode, setMode] = useState(null);
  const [roomCode, setRoomCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [players, setPlayers] = useState([]);
  const [socket, setSocket] = useState(null);
  const [isHost, setIsHost] = useState(false);

  useEffect(() => {
    const socketInstance = io("https://do-or-drink-game.onrender.com");
    setSocket(socketInstance);

    socketInstance.on("room-created", (roomCode) => {
      console.log(`Room ${roomCode} created`);
    });

    socketInstance.on("player-joined", (players) => {
      setPlayers(players);
    });

    socketInstance.on("start-game", () => {
      setGameStarted(true);
    });

    socketInstance.on("error", (message) => {
      alert(message);
    });

    return () => socketInstance.disconnect();
  }, []);

  const getDeviceName = () => {
    const ua = navigator.userAgent;
    if (/mobile/i.test(ua)) return "📱 Mobile User";
    if (/tablet/i.test(ua)) return "📱 Tablet User";
    if (/Macintosh|Windows|Linux/i.test(ua)) return "💻 Desktop User";
    return "🌐 Unknown Device";
  };

  const handleCreateRoom = () => {
    const generatedCode = Math.random().toString(36).substring(2, 7).toUpperCase();
    setRoomCode(generatedCode);
    setMode("create");
    setIsHost(true);
    socket.emit("create-room", generatedCode);
    socket.emit("join-room", generatedCode, getDeviceName());
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleJoinRoom = () => {
    if (roomCode.trim().length < 4) {
      alert("Please enter a valid room code.");
      return;
    }
    setMode("join");
    socket.emit("join-room", roomCode, getDeviceName());
  };

  const handleStartGame = () => {
    if (players.length < 2) {
      alert("At least 2 players are needed to start the game!");
      return;
    }
    socket.emit("start-game", roomCode);
  };

  if (gameStarted) {
    return <OnlineDares onLeave={onBack} theme={theme} players={players} />;
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-start justify-center px-4 py-8 bg-gradient-to-br from-indigo-900 to-purple-700 text-white dark:from-black dark:to-gray-900 transition-all relative">
      
      {/* Sidebar Section */}
      <div className="w-full md:w-1/4 min-h-[300px] md:min-h-screen bg-black bg-opacity-70 p-6 rounded-xl shadow-lg space-y-6 flex flex-col mb-6 md:mb-0">
        <h2 className="text-2xl font-semibold text-center">Players in Room</h2>
        <div className="flex flex-col gap-4 overflow-y-auto max-h-80 md:max-h-[500px]">
          {players.length > 0 ? (
            players.map((player, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-purple-700 p-4 rounded-xl shadow-md hover:bg-purple-600 transition-all"
              >
                <span>{player}</span>
                <span className="text-xs bg-gray-500 px-2 py-1 rounded-full">Player {index + 1}</span>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-400">No players yet</div>
          )}
        </div>

        {/* Show Start Game Button for Host */}
        {isHost && players.length > 1 && (
          <button
            onClick={handleStartGame}
            className="w-full mt-4 bg-green-500 hover:bg-green-400 text-black font-bold py-3 rounded-lg transition-all"
          >
            🚀 Start Game
          </button>
        )}
      </div>

      {/* Main Content Section */}
      <div className="flex flex-col items-center justify-center w-full md:w-3/4 px-6">
        <button
          onClick={onBack}
          className="absolute top-4 left-4 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-full text-sm font-semibold shadow-lg transition"
        >
          ← Back
        </button>

        <h1 className="text-4xl md:text-5xl font-extrabold mb-8 text-center animate-pulse drop-shadow-lg">
          🌍 Play Online
        </h1>

        {!mode && (
          <div className="flex flex-col gap-6 w-full max-w-sm">
            <motion.button
              onClick={handleCreateRoom}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="py-4 px-6 bg-green-500 hover:bg-green-400 text-black font-bold rounded-xl text-lg shadow-lg transition-all"
            >
              ➕ Create Room
            </motion.button>

            <div className="flex items-center justify-center gap-2">
              <hr className="flex-grow border-gray-400" />
              <span className="text-sm text-gray-300">OR</span>
              <hr className="flex-grow border-gray-400" />
            </div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white text-black rounded-xl p-6 shadow-lg flex flex-col gap-4"
            >
              <input
                type="text"
                placeholder="Enter Room Code"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
              <button
                onClick={handleJoinRoom}
                className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 rounded-lg transition-all"
              >
                🔑 Join Room
              </button>
            </motion.div>
          </div>
        )}

        {mode === "create" && (
          <div className="flex flex-col items-center gap-6">
            <p className="text-lg mt-6">✅ Room Created!</p>
            <div className="text-3xl font-bold bg-white text-black px-6 py-3 rounded-lg shadow-lg tracking-widest">
              {roomCode}
            </div>
            <p className="text-sm text-gray-300 mt-2">Share this code with your friends!</p>

            <button
              onClick={handleCopyCode}
              className="mt-4 bg-yellow-400 hover:bg-yellow-300 text-black font-bold py-2 px-4 rounded-full shadow transition"
            >
              {copied ? "✅ Copied!" : "📋 Copy Code"}
            </button>
          </div>
        )}

        {mode === "join" && (
          <div className="flex flex-col items-center gap-6 mt-6">
            <p className="text-lg">🔄 Attempting to join room...</p>
            <div className="text-2xl font-bold">{roomCode}</div>
            <p className="text-sm text-gray-300 mt-2">Waiting for the game to start...</p>
          </div>
        )}
      </div>
    </div>
  );
}
