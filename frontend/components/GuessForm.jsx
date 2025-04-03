import React from 'react';
import './GuessForm.css';

function GuessForm({ guess, setGuess, onGuess, wordLength }) {
  return (
    <div className="guess-form">
      <input
        type="text"
        value={guess}
        onChange={(e) => setGuess(e.target.value)}
        placeholder="Skriv din gissning"
        maxLength={wordLength}
        className="guess-input"
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            onGuess();
          }
        }}
      />

      <button
        onClick={onGuess}
        disabled={!guess || !wordLength}
        className="guess-input"
      >
        Enter
      </button>
    </div>
  );
}

export default GuessForm;