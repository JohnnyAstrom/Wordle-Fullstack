import React from 'react';
import './GameSetup.css';

function GameSetup({ onStart, wordLength }) {
  return (
    <div>
      <button className="newgame-button" onClick={onStart}>Starta nytt spel</button>

      {wordLength && (
        <p>Ordets längd: {wordLength}</p>
      )}
    </div>
  );
}

export default GameSetup;