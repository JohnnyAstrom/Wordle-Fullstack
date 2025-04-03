import React, { useState } from 'react';
import './GameSetup.css';

function GameSetup({ onStart }) {
  const [wordLength, setWordLength] = useState(5);

  const handleStart = () => {
    onStart(wordLength);
  };
    
  return (
    <div>
      <label htmlFor="word-length">Välj ordlängd: </label>
      <select
        id="word-length"
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
      <br></br>
      <br></br>
      <button className="newgame-button" onClick={handleStart}>Starta nytt spel</button>
    </div>
  );
}

export default GameSetup;