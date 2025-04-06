import React from 'react';
import './CustomKeyboard.css';

const letters = 'QWERTYUIOPASDFGHJKLZXCVBNM'.split('');

function CustomKeyboard({ onKeyPress, keyFeedback }) {
  const rows = [
    letters.slice(0, 10),
    letters.slice(10, 19),
    letters.slice(19),
  ];

  const getClassName = (letter) => {
    const result = keyFeedback[letter];
    if (result === 'correct') return 'key correct';
    if (result === 'misplaced') return 'key misplaced';
    if (result === 'incorrect') return 'key incorrect';
    return 'key';
  };

  return (
    <div className="keyboard-container">
      {rows.map((row, rowIndex) => (
        <div className="keyboard-row" key={rowIndex}>
          {rowIndex === 2 && (
            <button className="key special" onClick={() => onKeyPress('ENTER')}>
              Enter
            </button>
          )}

          {row.map((letter) => (
            <button
              key={letter}
              className={getClassName(letter)}
              onClick={() => onKeyPress(letter)}
            >
              {letter}
            </button>
          ))}

          {rowIndex === 2 && (
            <button className="key special" onClick={() => onKeyPress('BACKSPACE')}>⌫</button>
          )}
        </div>
      ))}
    </div>
  );
}

export default CustomKeyboard;