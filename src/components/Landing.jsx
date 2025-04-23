import { useState } from "react";

const themes = ["All", "Funny", "Nasty", "Muscular", "Couples", "Silly", "Freak", "Wild"];

export default function Landing({
  setTheme,
  theme,
  themeType,
  setThemeType,
  playerCount,
  setPlayerCount,
  onContinue
}) {
  const [selectedTheme, setSelectedTheme] = useState(themeType || "All");
  const [playerCountInput, setPlayerCountInput] = useState(playerCount || 2);

  const handleThemeToggle = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleContinue = () => {
    if (playerCountInput < 2 || playerCountInput > 12) {
      alert("Choose between 2 and 12 players");
      return;
    }

    setThemeType(selectedTheme);               // Update parent with selected theme
    setPlayerCount(playerCountInput);          // Update parent with selected player count
    onContinue(playerCountInput);              // Pass correct count to App
  };

  return (
    <div className="flex flex-col items-center justify-center py-10 px-4">
      <h1 className="text-4xl font-bold mb-6">🎉 Do or Drink</h1>

      <button
        onClick={handleThemeToggle}
        className="mb-6 px-4 py-2 border rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
      >
        Toggle to {theme === "dark" ? "Light" : "Dark"} Mode
      </button>

      <div className="mb-6 w-full max-w-sm">
        <label className="block text-lg mb-2">Choose a Theme</label>
        <select
          value={selectedTheme}
          onChange={(e) => setSelectedTheme(e.target.value)}
          className="w-full p-2 rounded border dark:bg-gray-800 dark:text-white"
        >
          {themes.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      <div className="mb-6 w-full max-w-sm">
        <label className="block text-lg mb-2">Number of Players</label>
        <input
          type="number"
          min={2}
          max={12}
          value={playerCountInput}
          onChange={(e) => setPlayerCountInput(parseInt(e.target.value))}
          className="w-full p-2 rounded border dark:bg-gray-800 dark:text-white"
        />
      </div>

      <button
        onClick={handleContinue}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Continue
      </button>
    </div>
  );
}
