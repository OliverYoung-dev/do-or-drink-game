import { useState, useEffect } from "react";
import Landing from "./components/Landing";
import PlayerForm from "./components/PlayerForm";
import GameBoard from "./components/GameBoard";
import OnlineLobby from "./components/OnlineLobby"; 
import OnlineGameBoard from "./components/OnlineGameBoard"; 
import LoadingScreen from "./components/LoadingScreen";
import { registerSW } from "virtual:pwa-register";
import { Analytics } from "@vercel/analytics/react";

registerSW({ immediate: true });

function App() {
  const getSystemTheme = () =>
    window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

  const [themeMode, setThemeMode] = useState(getSystemTheme());
  const [themeType, setThemeType] = useState("All");
  const [playerCount, setPlayerCount] = useState(2);
  const [playerNames, setPlayerNames] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [showLoader, setShowLoader] = useState(true);
  
  const [gameMode, setGameMode] = useState(null); // 👈 'local' or 'online'
  const [roomCode, setRoomCode] = useState(null); // 👈 for online
  const [onlinePlayers, setOnlinePlayers] = useState([]); // 👈 for online players

  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallBtn, setShowInstallBtn] = useState(false);
  const [showIosPopup, setShowIosPopup] = useState(false);

  const isIos = () => /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase());
  const isInStandaloneMode = () => "standalone" in window.navigator && window.navigator.standalone;

  useEffect(() => {
    const themeMedia = window.matchMedia("(prefers-color-scheme: dark)");
    const handleThemeChange = (e) => setThemeMode(e.matches ? "dark" : "light");
    themeMedia.addEventListener("change", handleThemeChange);

    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBtn(true);
    });

    if (isIos() && !isInStandaloneMode()) {
      setShowIosPopup(true);
    }

    const timer = setTimeout(() => setShowLoader(false), 4000);

    return () => {
      clearTimeout(timer);
      themeMedia.removeEventListener("change", handleThemeChange);
    };
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(() => {
        setDeferredPrompt(null);
        setShowInstallBtn(false);
      });
    }
  };

  const resetGame = () => {
    setGameMode(null);
    setPlayerNames([]);
    setOnlinePlayers([]);
    setRoomCode(null);
    setGameStarted(false);
  };

  if (showLoader) return <LoadingScreen />;

  return (
    <div
      className={themeMode === "dark" 
        ? "bg-gray-900 text-white min-h-screen" 
        : "bg-white text-black min-h-screen"}
    >
      {/* Android Install Button */}
      {showInstallBtn && !isIos() && (
        <button
          onClick={handleInstallClick}
          className="fixed top-4 right-4 px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 z-50"
        >
          📲 Install App
        </button>
      )}

      {/* iOS Install Banner */}
      {showIosPopup && (
        <div className="fixed bottom-4 left-4 right-4 z-50 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 p-4 rounded-xl shadow-md flex items-center gap-3 animate-slideUp">
          <span className="text-xl">📱</span>
          <div className="text-sm text-gray-800 dark:text-gray-100">
            Install this app: tap <strong>Share</strong> then <strong>“Add to Home Screen”</strong>
          </div>
          <button
            onClick={() => setShowIosPopup(false)}
            className="ml-auto text-gray-500 hover:text-gray-800 dark:hover:text-white text-sm"
          >
            ✖
          </button>
        </div>
      )}

      {/* GAME SCREENS */}
      {!gameMode ? (
        <Landing
          setTheme={setThemeMode}
          theme={themeMode}
          themeType={themeType}
          setThemeType={setThemeType}
          playerCount={playerCount}
          setPlayerCount={setPlayerCount}
          onLocalPlay={(count) => {
            setGameMode("local");
            setPlayerNames(new Array(count).fill(""));
            setGameStarted(false);
          }}
          onOnlinePlay={() => {
            setGameMode("online");
          }}
        />
      ) : gameMode === "local" ? (
        !playerNames.length ? (
          <Landing /* fallback */ />
        ) : !gameStarted ? (
          <PlayerForm
            playerNames={playerNames}
            setPlayerNames={setPlayerNames}
            onStart={() => setGameStarted(true)}
            onBack={() => setPlayerNames([])}
            theme={themeMode}
          />
        ) : (
          <GameBoard playerNames={playerNames} themeType={themeType} />
        )
      ) : gameMode === "online" ? (
        !roomCode ? (
          <OnlineLobby
            setRoomCode={setRoomCode}
            setOnlinePlayers={setOnlinePlayers}
            theme={themeMode}
            onBack={() => setGameMode(null)}
          />
        ) : (
          <OnlineGameBoard
            players={onlinePlayers}
            roomCode={roomCode}
            onExit={resetGame}
          />
        )
      ) : null}

      <Analytics />
    </div>
  );
}

export default App;
