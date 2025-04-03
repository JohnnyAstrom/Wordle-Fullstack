import React, { useState } from 'react';
import './GameSetup.css';

function GameSetup({ onStart }) {
  const [wordLength, setWordLength] = useState(5);
  const [uniqueLetters, setUniqueLetters] = useState(false);

  const handleStart = () => {
    onStart(wordLength, uniqueLetters);
  };

  return (
    <div>
      <label htmlFor="word-length">Välj ordlängd: </label>
      <select
        className="word-length"
        value={wordLength}
        onChange={(e) => setWordLength(Number(e.target.value))}
      >
        {[5, 6, 7, 8].map((length) => (
          <option
            key={length}
            value={length}>
            {length}
          </option>
        ))}
      </select>

      <div>
        <label htmlFor="unique letters">Endast unika bokstäver:</label>
        <input
          type="checkbox"
          className="unique-letters"
          checked={uniqueLetters}
          onChange={(e) => setUniqueLetters(e.target.checked)}
        />
      </div>

      <button className="newgame-button" onClick={handleStart}>Starta nytt spel</button>
    </div>
  );
}

export default GameSetup;