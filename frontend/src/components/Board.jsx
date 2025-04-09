import React, { useEffect, useState } from 'react';
import './Board.css';

function Board({ guessHistory, currentGuess, wordLength, maxGuesses = 6 }) {
  const [revealed, setRevealed] = useState([]);

  useEffect(() => {
    if (guessHistory.length > 0) {
      const latestIndex = guessHistory.length - 1;
      guessHistory[latestIndex].feedback.forEach((_, i) => {
        setTimeout(() => {
          setRevealed(prev => [...prev, `${latestIndex}-${i}`]);
        }, i * 200); // Visa en i taget
      });
    }
  }, [guessHistory]);

  const rows = [];

  for (let i = 0; i < maxGuesses; i++) {
    let letters = [];

    if (i < guessHistory.length) {
      letters = guessHistory[i].feedback.map((item, j) => {
        const key = `${i}-${j}`;
        const className = revealed.includes(key) ? `tile ${item.result}` : 'tile';
        return (
          <div key={j} className={className}>
            {item.letter.toUpperCase()}
          </div>
        );
      });
    } else if (i === guessHistory.length) {
      for (let j = 0; j < wordLength; j++) {
        letters.push(
          <div key={j} className="tile active">
            {currentGuess[j]?.toUpperCase() || ''}
          </div>
        );
      }
    } else {
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