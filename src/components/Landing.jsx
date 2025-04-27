import { useState } from "react";
import { motion } from "framer-motion";

const themes = [
  "All", "Funny", "Nasty", "Muscular", "Couples", "Silly", "Freak", "Wild", "Naughty"
];

export default function Landing({
  setTheme,
  theme,
  themeType,
  setThemeType,
  playerCount,
  setPlayerCount,
  onLocalPlay,
  onOnlinePlay
}) {
  const [selectedMode, setSelectedMode] = useState("local"); // local or online
  const [selectedTheme, setSelectedTheme] = useState(themeType || "All");
  const [playerCountInput, setPlayerCountInput] = useState(playerCount || 2);

  const handleContinueLocal = () => {
    if (playerCountInput < 2 || playerCountInput > 12) {
      alert("Choose between 2 and 12 players");
      return;
    }
    setThemeType(selectedTheme);
    setPlayerCount(playerCountInput);
    onLocalPlay(playerCountInput); // 🚀 correct prop now
  };

  const handlePlayOnline = () => {
    onOnlinePlay(); // 🚀 correct prop now
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10 bg-gradient-to-br from-purple-900 to-pink-700 text-white dark:from-black dark:to-gray-900 transition-all">
      <h1 className="text-5xl md:text-6xl font-extrabold mb-8 tracking-tight text-center animate-pulse drop-shadow-lg">
        🎉 Do or Drink
      </h1>

      {/* Play Mode Selector */}
      <div className="flex space-x-4 mb-10">
        <motion.button
          whileTap={{ scale: 0.95 }}
          className={`px-6 py-3 rounded-full font-bold transition ${
            selectedMode === "local" ? "bg-white text-black" : "bg-transparent border-2 border-white hover:bg-white hover:text-black"
          }`}
          onClick={() => setSelectedMode("local")}
        >
          🏠 Play Locally
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.95 }}
          className={`px-6 py-3 rounded-full font-bold transition ${
            selectedMode === "online" ? "bg-white text-black" : "bg-transparent border-2 border-white hover:bg-white hover:text-black"
          }`}
          onClick={() => setSelectedMode("online")}
        >
          🌍 Play Online
        </motion.button>
      </div>

      {/* Conditionally Render Sections */}
      {selectedMode === "local" ? (
        <>
          {/* Theme Selector */}
          <div className="mb-10 w-full max-w-2xl">
            <h2 className="text-xl font-semibold mb-3 text-center">🎨 Choose a Theme</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {themes.map((t) => (
                <motion.button
                  key={t}
                  onClick={() => setSelectedTheme(t)}
                  whileTap={{ scale: 0.95 }}
                  className={`py-3 px-4 rounded-xl font-medium text-center border-2 ${
                    selectedTheme === t
                      ? "bg-white text-black border-white dark:bg-pink-500 dark:text-white"
                      : "bg-transparent border-white hover:bg-white hover:text-black"
                  } transition-all duration-300`}
                >
                  {t}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Player Count Input */}
          <div className="mb-10 w-full max-w-xs">
            <label className="block text-lg font-medium mb-2 text-center">👥 Number of Players</label>
            <input
              type="number"
              min={2}
              max={12}
              value={playerCountInput}
              onChange={(e) => setPlayerCountInput(parseInt(e.target.value))}
              className="w-full px-4 py-3 rounded-lg border-none text-black font-semibold shadow focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          </div>

          {/* Start Local Game */}
          <motion.button
            onClick={handleContinueLocal}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-yellow-400 text-black font-bold text-lg rounded-full shadow-xl hover:bg-yellow-300 transition-all"
          >
            🚀 Start Local Game
          </motion.button>
        </>
      ) : (
        <>
          {/* Play Online */}
          <div className="flex flex-col items-center space-y-6">
            <p className="text-lg font-semibold text-center">Ready to play with friends anywhere? 🌍</p>

            <motion.button
              onClick={handlePlayOnline}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-green-400 text-black font-bold text-lg rounded-full shadow-xl hover:bg-green-300 transition-all"
            >
              🔗 Go to Online Lobby
            </motion.button>
          </div>
        </>
      )}
    </div>
  );
}
