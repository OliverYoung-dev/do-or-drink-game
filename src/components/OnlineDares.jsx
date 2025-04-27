import { useState } from "react";
import { motion } from "framer-motion";

const dares = [
  "Do 10 pushups!",
  "Sing your favorite song loudly!",
  "Act like a chicken for 10 seconds!",
  "Tell an embarrassing story!",
  "Dance without music for 15 seconds!",
  "Imitate someone in the group!",
  "Say the alphabet backwards!",
  "Pretend to cry like a baby for 20 seconds!",
  "Compliment every player!",
  "Do a handstand (or try!)",
  // You can load more dares from server later
];

export default function OnlineDares({ onLeave }) {
  const [currentDare, setCurrentDare] = useState(getRandomDare());

  function getRandomDare() {
    return dares[Math.floor(Math.random() * dares.length)];
  }

  const handleNextDare = () => {
    setCurrentDare(getRandomDare());
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 bg-gradient-to-br from-pink-700 to-purple-700 text-white dark:from-black dark:to-gray-900 transition-all relative">
      {/* Leave Button */}
      <button
        onClick={onLeave}
        className="absolute top-6 left-6 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-full text-sm font-semibold shadow-lg transition"
      >
        ← Leave
      </button>

      <motion.h1
        className="text-4xl md:text-5xl font-extrabold mb-12 text-center animate-pulse drop-shadow-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        🎉 Your Dare
      </motion.h1>

      {/* Dare Card */}
      <motion.div
        key={currentDare}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="bg-white text-black rounded-xl px-8 py-12 shadow-2xl text-2xl font-bold text-center max-w-lg"
      >
        {currentDare}
      </motion.div>

      {/* Next Dare Button */}
      <motion.button
        onClick={handleNextDare}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="mt-12 px-8 py-4 bg-yellow-400 hover:bg-yellow-300 text-black font-bold text-lg rounded-full shadow-xl transition-all"
      >
        🎯 Next Dare
      </motion.button>
    </div>
  );
}
