import { useState, useEffect } from "react";
import Landing from "./components/Landing";
import PlayerForm from "./components/PlayerForm";
import GameBoard from "./components/GameBoard";
import { registerSW } from "virtual:pwa-register";

registerSW({ immediate: true });


function App() {
  const [themeMode, setThemeMode] = useState("light");
  const [themeType, setThemeType] = useState("All");
  const [playerCount, setPlayerCount] = useState(2);
  const [playerNames, setPlayerNames] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);

  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallBtn, setShowInstallBtn] = useState(false);

  // Capture install prompt
  useEffect(() => {
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBtn(true);
    });

    // Cleanup event listener
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

      {/* Install App Button */}
      {showInstallBtn && (
        <button
          onClick={handleInstallClick}
          className="fixed top-4 left-4 px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 z-50"
        >
          📲 Install App
        </button>
      )}

      {/* Conditional Screens */}
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
    </div>
  );
}

export default App;
