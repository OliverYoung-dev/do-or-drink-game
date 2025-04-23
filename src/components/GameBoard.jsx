import { useState, useEffect } from "react";
import daresData from "../data/dares"; // still using sample dares

export default function GameBoard({ playerNames, themeType }) {
  const [remainingDares, setRemainingDares] = useState([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [currentDare, setCurrentDare] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [voices, setVoices] = useState([]);

  // Load saved game from localStorage
  useEffect(() => {
    const savedGame = JSON.parse(localStorage.getItem("doOrDrinkGame"));
    if (savedGame) {
      setRemainingDares(savedGame.remainingDares || []);
      setCurrentPlayerIndex(savedGame.currentPlayerIndex || 0);
      setCurrentDare(savedGame.currentDare || null);
    }
  }, []);

  const isIos = () => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    return /iphone|ipad|ipod/.test(userAgent);
  };
  
  const isInStandaloneMode = () =>
    "standalone" in window.navigator && window.navigator.standalone;
  
  const [showIosPopup, setShowIosPopup] = useState(false);
  
  useEffect(() => {
    if (isIos() && !isInStandaloneMode()) {
      setShowIosPopup(true);
    }
  }, []);
  
  useEffect(() => {
    if (showIosPopup) {
      const closePopup = () => {
        setShowIosPopup(false);
      };
      window.addEventListener("beforeinstallprompt", closePopup);
      return () => {
        window.removeEventListener("beforeinstallprompt", closePopup);
      };
    }
  })  

  // Load voices (especially for Chrome)
  useEffect(() => {
    const loadVoices = () => {
      const loadedVoices = window.speechSynthesis.getVoices();
      setVoices(loadedVoices);
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  // Set up dares if not loaded
  useEffect(() => {
    if (remainingDares.length === 0) {
      let filtered = daresData;
      if (themeType !== "All") {
        filtered = daresData.filter((d) => d.theme === themeType);
      }
      setRemainingDares(shuffleArray(filtered));
    }
  }, [themeType, remainingDares]);

  // Speak function with female voice
  const speak = (text) => {
    // Stop any previous speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.pitch = 1;
    utterance.rate = 0.95;

    // Find a soft female voice
    const preferred = voices.find(
      (v) =>
        v.name.toLowerCase().includes("female") ||
        v.name.toLowerCase().includes("samantha") ||
        v.name.toLowerCase().includes("zira") ||
        v.name.toLowerCase().includes("moira") ||
        v.gender === "female"
    );

    if (preferred) {
      utterance.voice = preferred;
    }

    window.speechSynthesis.speak(utterance);
  };

  // Handle next turn
  const nextTurn = () => {
    if (remainingDares.length === 0) {
      setCurrentDare("No more dares left! Game Over!");
      setGameOver(true);
      return;
    }

    const dare = remainingDares.pop();
    setRemainingDares([...remainingDares]);
    setCurrentDare(dare.text);

    const nextPlayer = (currentPlayerIndex + 1) % playerNames.length;
    setCurrentPlayerIndex(nextPlayer);

    const playerName = playerNames[nextPlayer];
    speak(`It's ${playerName}'s turn`);
    setTimeout(() => speak(dare.text), 800);
  };

  // Restart game
  const restartGame = () => {
    setRemainingDares([]);
    setCurrentDare(null);
    setCurrentPlayerIndex(0);
    setGameOver(false);
    setTimeout(nextTurn, 100);
  };

  return (
    <div className="min-h-screen px-4 py-8 bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors">
      <div className="max-w-xl mx-auto text-center">
  
        {/* Turn Banner */}
        <h2 className="text-3xl md:text-4xl font-extrabold mb-6 animate-pulse">
          🎲 It's <span className="text-purple-500">{playerNames[currentPlayerIndex]}</span>'s turn!
        </h2>
  
        {/* Dare Card */}
        <div
  className={`
    min-h-[150px] text-xl font-medium flex items-center justify-center
    p-6 mb-6 transition-all duration-500 rounded-2xl shadow-xl border
    bg-white/20 dark:bg-gray-800/40 backdrop-blur-md
    border-purple-300 dark:border-purple-700
    text-gray-800 dark:text-white
    dare-card ${currentDare ? "dare-card-reveal" : ""}
  `}
>
  {currentDare ? (
    <span className="animate-fadeIn">
      🎉 {currentDare}
    </span>
  ) : (
    "Click below to get a dare!"
  )}
</div>
{showIosPopup && (
  <div className="fixed bottom-4 left-4 right-4 z-50 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 p-4 rounded-xl shadow-xl flex items-center gap-3">
    <span role="img" aria-label="install" className="text-xl">📲</span>
    <div className="text-sm text-gray-800 dark:text-white">
      Install this app: tap <strong>Share</strong> then <strong>“Add to Home Screen”</strong>.
    </div>
    <button
      onClick={() => setShowIosPopup(false)}
      className="ml-auto text-gray-500 hover:text-gray-800 dark:hover:text-white text-sm"
    >
      ✖
    </button>
  </div>
)}

  
        {/* Remaining Dares */}
        <p className="text-lg font-semibold mb-4">
          Remaining Dares: {remainingDares.length}
        </p>
  
        {/* Get Dare Button */}
        {!gameOver && (
          <button
            onClick={nextTurn}
            className="w-full md:w-auto px-8 py-4 bg-purple-600 text-white text-lg rounded-xl font-bold shadow-lg hover:bg-purple-700 transition"
          >
            🎯 Get Dare
          </button>
        )}
  
        {/* Game Over + Restart */}
        {gameOver && (
          <div className="mt-6">
            <p className="text-lg mb-4 font-semibold">🥳 You've completed all the dares!</p>
            <button
              onClick={restartGame}
              className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold shadow hover:bg-blue-700 transition"
            >
              🔄 Restart Game
            </button>
          </div>
        )}
      </div>
    </div>  
  );
  
}

// Helper to shuffle dares
function shuffleArray(array) {
  return [...array].sort(() => Math.random() - 0.5);
}
