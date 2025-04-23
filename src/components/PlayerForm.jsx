import { useState } from "react";

export default function PlayerForm({ playerNames, setPlayerNames, onStart }) {
  const [error, setError] = useState("");

  const handleChange = (index, value) => {
    const updated = [...playerNames];
    updated[index] = value;
    setPlayerNames(updated);
  };

  const handleSubmit = () => {
    if (playerNames.some((name) => name.trim() === "")) {
      setError("All players must have a name!");
      return;
    }
    setError("");
    onStart();
  };

  return (
    <div className="max-w-xl mx-auto py-10 px-4">
      <h2 className="text-3xl font-bold mb-4">Enter Player Names</h2>
      {playerNames.map((name, i) => (
        <input
          key={i}
          type="text"
          value={name}
          onChange={(e) => handleChange(i, e.target.value)}
          placeholder={`Player ${i + 1}`}
          className="w-full mb-3 p-2 rounded border dark:bg-gray-800 dark:text-white"
        />
      ))}

      {error && <p className="text-red-500">{error}</p>}

      <button
        onClick={handleSubmit}
        className="mt-4 px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Start Game
      </button>
    </div>
  );
}
