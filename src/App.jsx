import { useState, useEffect } from "react";
import Landing from "./components/Landing";
import PlayerForm from "./components/PlayerForm";
import GameBoard from "./components/GameBoard";
import { registerSW } from "virtual:pwa-register";
import { Analytics } from "@vercel/analytics/react";

registerSW({ immediate: true });

function App() {
  const [themeMode, setThemeMode] = useState("light");
  const [themeType, setThemeType] = useState("All");
  const [playerCount, setPlayerCount] = useState(2);
  const [playerNames, setPlayerNames] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);

  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallBtn, setShowInstallBtn] = useState(false);
  const [showIosPopup, setShowIosPopup] = useState(false);

  // Detect iOS Safari
  const isIos = () => {
    const ua = window.navigator.userAgent.toLowerCase();
    return /iphone|ipad|ipod/.test(ua);
  };

  const isInStandaloneMode = () =>
    "standalone" in window.navigator && window.navigator.standalone;

  useEffect(() => {
    // Detect Android-style install prompt
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBtn(true);
    });

    // Detect iOS install guide
    if (isIos() && !isInStandaloneMode()) {
      setShowIosPopup(true);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", () => {});
    };
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          console.log("User accepted the install prompt");
        } else {
          console.log("User dismissed the install prompt");
        }
        setDeferredPrompt(null);
        setShowInstallBtn(false);
      });
    }
  };

  const isReadyForNames = playerNames.length > 0;

  return (
    <div
      className={
        themeMode === "dark"
          ? "bg-gray-900 text-white min-h-screen"
          : "bg-white text-black min-h-screen"
      }
    >
      {/* Theme Toggle */}
      <button
        onClick={() =>
          setThemeMode(themeMode === "light" ? "dark" : "light")
        }
        className="fixed top-4 right-4 p-2 bg-gray-800 text-white rounded-full z-50"
      >
        {themeMode === "light" ? "Dark" : "Light"} Mode
      </button>

      {/* Android PWA Install Button */}
      {showInstallBtn && !isIos() && (
  <button
    onClick={handleInstallClick}
    className="fixed top-4 left-4 px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 z-50"
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

      {/* Screens */}
      {!isReadyForNames ? (
        <Landing
          setTheme={setThemeMode}
          theme={themeMode}
          themeType={themeType}
          setThemeType={setThemeType}
          playerCount={playerCount}
          setPlayerCount={setPlayerCount}
          onContinue={(count) => {
            setPlayerNames(new Array(count).fill(""));
            setGameStarted(false);
          }}
        />
      ) : !gameStarted ? (
        <PlayerForm
          playerNames={playerNames}
          setPlayerNames={setPlayerNames}
          onStart={() => setGameStarted(true)}
        />
      ) : (
        <GameBoard playerNames={playerNames} themeType={themeType} />
      )}

      <Analytics />
    </div>
  );
}

export default App;
