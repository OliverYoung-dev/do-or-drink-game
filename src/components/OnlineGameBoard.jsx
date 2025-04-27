import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// A simple set of online dares
const onlineDares = [
  "Send a funny meme to the group chat 📸",
  "Do 10 jumping jacks on camera 🏋️",
  "Change your profile picture to something silly for 10 minutes 🤪",
  "Make a weird face and hold it for 15 seconds 😂",
  "Sing a random song line loudly 🎤",
  "Pretend you're an animal for 20 seconds 🦁",
  "Take a selfie doing your best superhero pose 🦸‍♂️",
  "Tell a funny joke — no laughing! 😐",
  "Do your best dance move 💃",
  "Spell your name backward without mistakes 🔤",
];

export default function OnlineGameBoard({ players, roomCode, onExit }) {
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [currentDare, setCurrentDare] = useState("");

  useEffect(() => {
    generateRandomDare();
  }, []);

  const generateRandomDare = () => {
    const randomIndex = Math.floor(Math.random() * onlineDares.length);
    setCurrentDare(onlineDares[randomIndex]);
  };

  const handleNext = () => {
    setCurrentPlayerIndex((prev) => (prev + 1) % players.length);
    generateRandomDare();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 bg-gradient-to-br from-blue-800 to-purple-700 text-white dark:from-black dark:to-gray-900 transition-all relative">
      
      {/* Exit Button */}
      <button
        onClick={onExit}
        className="absolute top-6 left-6 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-full text-sm font-semibold shadow-lg transition"
      >
        ✖ Exit
      </button>

      <h1 className="text-4xl md:text-5xl font-extrabold mb-8 text-center animate-pulse">
        🚀 Online Dare Time
      </h1>

      {/* Room Code Display */}
      <div className="text-sm text-gray-300 mb-8">
        Room Code: <span className="font-bold">{roomCode}</span>
      </div>

      {/* Player Turn */}
      <motion.div
        key={currentPlayerIndex}
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 30 }}
        transition={{ duration: 0.5 }}
        className="text-2xl md:text-3xl font-bold mb-4"
      >
        🎯 {players[currentPlayerIndex]}'s Turn
      </motion.div>

      {/* Dare Display */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentDare}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.5 }}
          className="bg-white text-black rounded-2xl p-6 shadow-xl text-center text-lg md:text-xl max-w-lg"
        >
          {currentDare}
        </motion.div>
      </AnimatePresence>

      {/* Next Button */}
      <motion.button
        onClick={handleNext}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="mt-8 px-8 py-4 bg-green-400 hover:bg-green-300 text-black font-bold text-lg rounded-full shadow-lg transition-all"
      >
        ⏭️ Next Player
      </motion.button>
    </div>
  );
}
