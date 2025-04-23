import { useState } from "react";
import Landing from "./components/Landing";
import PlayerForm from "./components/PlayerForm";
import GameBoard from "./components/GameBoard";

function App() {
  const [themeMode, setThemeMode] = useState("light");
  const [themeType, setThemeType] = useState("All");
  const [playerCount, setPlayerCount] = useState(2);
  const [playerNames, setPlayerNames] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);

  // Use the proper condition to show PlayerForm or GameBoard after Landing
  const isReadyForNames = playerNames.length > 0; // Update this logic based on your flow

  return (
    <div className={themeMode === "dark" ? "bg-gray-900 text-white min-h-screen" : "bg-white text-black min-h-screen"}>
      {/* Theme Toggle */}
      <button onClick={() => setThemeMode(themeMode === "light" ? "dark" : "light")} className="fixed top-4 right-4 p-2 bg-gray-800 text-white rounded-full">
         {themeMode === "light" ? "Dark" : "Light"} Mode
      </button>  

      {/* Show Landing if playerNames is empty, otherwise PlayerForm */}
      {!isReadyForNames ? (
        <Landing
          setTheme={setThemeMode}
          theme={themeMode}
          themeType={themeType}
          setThemeType={setThemeType}
          playerCount={playerCount}
          setPlayerCount={setPlayerCount}
          onContinue={(count) => {
            setPlayerNames(new Array(count).fill("")); // Initialize empty names based on count
            setGameStarted(false); // Reset the game state if coming back to player setup
          }}
        />
      ) : !gameStarted ? (
        <PlayerForm
          playerNames={playerNames}
          setPlayerNames={setPlayerNames}
          onStart={() => setGameStarted(true)} // Start game after filling names
        />
      ) : (
        <GameBoard playerNames={playerNames} themeType={themeType} />
      )}
    </div>
  );
}

export default App;
