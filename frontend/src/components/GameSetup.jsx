import React from 'react';
import './GameSetup.css';

function GameSetup({ onStart }) {
  return (
    <div className="game-setup">
      <button onClick={() => onStart()}>Starta spel</button>
    </div>
  );
}

export default GameSetup;