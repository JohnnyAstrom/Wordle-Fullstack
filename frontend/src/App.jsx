import React, { useState, useEffect } from 'react';
import './App.css';
import GuessForm from '../components/GuessForm.jsx';
import GameSetup from '../components/GameSetup.jsx';
import GuessHistory from '../components/GuessHistory.jsx';
import CustomKeyboard from '../components/CustomKeyboard.jsx';

function App() {
  const [word, setWord] = useState(null);
  const [guess, setGuess] = useState('');
  const [guessHistory, setGuessHistory] = useState([]);
  const [gameMessage, setGameMessage] = useState('');
  const [usedLetters, setUsedLetters] = useState([]);
  const [keyFeedback, setKeyFeedback] = useState({});
  const MAX_GUESSES = 6;

  async function fetchWord(wordLength, uniqueLetters) {
    try {
      const response = await fetch(`http://localhost:5080/api/game/start?length=${wordLength}&unique=${uniqueLetters}`);
      const data = await response.json();
      setWord(data.word);
      setGuess('');
      setGuessHistory([]);
      setGameMessage('');
      setKeyFeedback({});
    } catch (error) {
      console.error('Could not fetch word:', error);
    }
  }

  async function handleGuess() {
    if (!guess || guess.length !== word.length) return;

    if (guessHistory.length >= MAX_GUESSES) {
      setGameMessage(`Du har nått maximala antal gissningar (${MAX_GUESSES}).`);
      return;
    }

    try {
      const response = await fetch('http://localhost:5080/api/game/guess', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          guessedWord: guess,
          correctWord: word
        }),
      });

      const result = await response.json();
      const newFeedback = result.feedback;

      const newGuess = { guess, feedback: newFeedback };
      setGuessHistory([...guessHistory, newGuess]);

      const updatedKeyFeedback = { ...keyFeedback };
      newFeedback.forEach(({ letter, result }) => {
        const current = updatedKeyFeedback[letter];
        if (result === 'correct' || (result === 'misplaced' && current !== 'correct')) {
          updatedKeyFeedback[letter] = result;
        } else if (!current) {
          updatedKeyFeedback[letter] = result;
        }
      });
      setKeyFeedback(updatedKeyFeedback);

      if (newFeedback.every((item) => item.result === 'correct')) {
        setGameMessage(`Grattis! Du gissade rätt! Ordet var: ${word}`);
      } else if (guessHistory.length + 1 >= MAX_GUESSES) {
        setGameMessage(`Du har förbrukat alla försök. Rätt ord var: ${word}`);
      }

      setUsedLetters([...usedLetters, ...guess.split('')]);
      setGuess('');

    } catch (error) {
      console.error('Error while sending guess:', error);
      setGameMessage('Ett fel uppstod vid skickandet av din gissning');
    }
  }

  const handleKeyPress = (key) => {
    if (key === 'BACKSPACE') {
      setGuess((prev) => prev.slice(0, -1));
    } else if (key === 'ENTER') {
      handleGuess();
    } else if (/^[A-ZÅÄÖ]$/.test(key)) {
      setGuess((prev) => (prev.length < word.length ? prev + key : prev));
    }
  };

  useEffect(() => {
    const handlePhysicalKey = (e) => {
      if (document.activeElement.tagName === 'INPUT') return;
      const key = e.key.toUpperCase();
      if (key === 'BACKSPACE' || key === 'ENTER' || /^[A-ZÅÄÖ]$/.test(key)) {
        handleKeyPress(key);
      }
    };
    window.addEventListener('keydown', handlePhysicalKey);
    return () => window.removeEventListener('keydown', handlePhysicalKey);
  }, [guess, word]);

  return (
    <div className="app-container">
      <h1>Wordle-spelet</h1>

      <GameSetup 
        onStart={fetchWord} 
      />

      {word && (
        <>
          <GuessForm
            guess={guess}
            setGuess={setGuess}
            onGuess={handleGuess}
            wordLength={word.length}
          />
          <CustomKeyboard 
            onKeyPress={handleKeyPress} 
            keyFeedback={keyFeedback} 
          />
        </>
      )}

      {guessHistory.length > 0 && (
        <GuessHistory 
          guessHistory={guessHistory} 
        />
      )}

      {gameMessage && (
        <div className="game-message">
          <p>{gameMessage}</p>
        </div>
      )}
    </div>
  );
}

export default App;