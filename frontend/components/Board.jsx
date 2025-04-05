import React from 'react';
import './Board.css';

function Board({ guessHistory, currentGuess, wordLength, maxGuesses = 6 }) {
  const rows = [];

  for (let i = 0; i < maxGuesses; i++) {
    let letters = [];

    if (i < guessHistory.length) {
      // Tidigare gissningar med feedback
      letters = guessHistory[i].feedback.map((item, index) => (
        <div key={index} className={`tile ${item.result}`}>
          {item.letter.toUpperCase()}
        </div>
      ));
    } else if (i === guessHistory.length) {
      // Pågående gissning
      for (let j = 0; j < wordLength; j++) {
        letters.push(
          <div key={j} className="tile active">
            {currentGuess[j]?.toUpperCase() || ''}
          </div>
        );
      }
    } else {
      // Kommande gissningar (tomma rutor)
      for (let j = 0; j < wordLength; j++) {
        letters.push(<div key={j} className="tile empty"></div>);
      }
    }

    rows.push(
      <div key={i} className="board-row">
        {letters}
      </div>
    );
  }

  return <div className="board-container">{rows}</div>;
}

export default Board;