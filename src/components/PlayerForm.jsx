import { useState, useEffect } from "react";

export default function PlayerForm({ playerNames, setPlayerNames, onStart, onBack }) {
  const [error, setError] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Detect system theme preference
  useEffect(() => {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setIsDarkMode(prefersDark);

    // Optional: Listen to changes in system preference
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e) => setIsDarkMode(e.matches);
    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const handleChange = (index, value) => {
    const updated = [...playerNames];
    updated[index] = value;
    setPlayerNames(updated);
  };

  const handleSubmit = () => {
    if (playerNames.some((name) => name.trim() === "")) {
      setError("Please enter names for all players!");
      return;
    }
    setError("");
    onStart();
  };

  return (
    <div
      className={`flex items-center justify-center min-h-screen px-4 transition-colors duration-300 ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
      }`}
    >
      <div
        className={`w-full max-w-2xl rounded-xl shadow-lg p-8 space-y-6 transition-colors duration-300 ${
          isDarkMode
            ? "bg-gradient-to-br from-gray-800 to-gray-900"
            : "bg-gradient-to-br from-purple-100 to-white"
        }`}
      >
        <h2 className="text-4xl font-extrabold text-center">🙋‍♀️ Enter Player Names</h2>

        <div className="grid grid-cols-1 gap-4">
          {playerNames.map((name, i) => (
            <input
              key={i}
              type="text"
              value={name}
              onChange={(e) => handleChange(i, e.target.value)}
              placeholder={`Player ${i + 1}`}
              className={`p-3 rounded-lg w-full ${
                isDarkMode
                  ? "bg-gray-700 text-white placeholder-gray-300"
                  : "bg-white text-black placeholder-gray-500"
              } focus:outline-none focus:ring-4 focus:ring-purple-400`}
            />
          ))}
        </div>

        {error && (
          <p className="text-red-500 text-center font-semibold">{error}</p>
        )}

        <div className="flex justify-between items-center mt-6">
          <button
            onClick={onBack}
            className={`px-5 py-2 rounded-lg border transition font-semibold ${
              isDarkMode
                ? "border-white text-white hover:bg-white hover:text-black"
                : "border-black text-black hover:bg-black hover:text-white"
            }`}
          >
            ⬅️ Go Back
          </button>

          <button
            onClick={handleSubmit}
            className="px-6 py-3 bg-green-500 hover:bg-green-600 rounded-lg font-bold text-white shadow"
          >
            ✅ Start Game
          </button>
        </div>
      </div>
    </div>
  );
}
