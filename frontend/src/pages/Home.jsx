import React, { useState, useEffect } from 'react';
import './Home.css';
import GameSetup from "../components/GameSetup.jsx";
import CustomKeyboard from "../components/CustomKeyboard.jsx";
import Board from "../components/Board.jsx";

function Home() {
  const [word, setWord] = useState(null);
  const [guess, setGuess] = useState('');
  const [guessHistory, setGuessHistory] = useState([]);
  const [gameMessage, setGameMessage] = useState('');
  const [usedLetters, setUsedLetters] = useState([]);
  const [keyFeedback, setKeyFeedback] = useState({});
  const [playerName, setPlayerName] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [hasWon, setHasWon] = useState(false);
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
      setPlayerName('');
      setIsSubmitted(false);
      setIsGameOver(false);
      setHasWon(false);
    } catch (error) {
      console.error('Could not fetch word:', error);
    }
  }

  async function handleHighscoreSubmit() {
    if (!playerName) {
      setGameMessage('Du måste skriva ett namn!');
      return;
    }

    try {
      const response = await fetch('http://localhost:5080/api/game/highscore', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          name: playerName,
          wordLength: word.length,
          attempts: guessHistory.length,
        }),
      });

      if (response.ok) {
        setIsSubmitted(true);
      } else {
        const error = await response.json();
        console.error('Error saving highscore:', error);
        setGameMessage('Kunde inte spara highscore.');
      }
    } catch (error) {
      console.error('Nätverksfel:', error);
      setGameMessage('Nätverksfel vid sparande av highscore.');
    }
  }

  async function handleGuess() {
    if (isGameOver || !guess || guess.length !== word.length)
      return;

    if (guessHistory.length >= MAX_GUESSES) {
      setGameMessage(`Du har nått maximala antal gissningar (${MAX_GUESSES}).`);
      setIsGameOver(true);
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
        setGameMessage(`Du gissade rätt! Ordet var: ${word}`);
        setIsGameOver(true);
        setHasWon(true);
      } else if (guessHistory.length + 1 >= MAX_GUESSES) {
        setGameMessage(`Du har använt alla försök. Rätt ord var: ${word}`);
        setIsGameOver(true);
      }

      setUsedLetters([...usedLetters, ...guess.split('')]);
      setGuess('');

    } catch (error) {
      console.error('Error while sending guess:', error);
      setGameMessage('Ett fel uppstod vid skickandet av din gissning');
    }
  }

  const handleKeyPress = (key) => {
    if (isGameOver) return;

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
      const key = e.key.toUpperCase();

      if (document.activeElement.tagName === 'INPUT') return;

      if (key === 'ENTER') {
        e.preventDefault();
        handleKeyPress('ENTER');
      } else if (key === 'BACKSPACE') {
        e.preventDefault();
        handleKeyPress('BACKSPACE');
      } else if (/^[A-ZÅÄÖ]$/.test(key)) {
        handleKeyPress(key);
      }
    };

    window.addEventListener('keydown', handlePhysicalKey);
    return () => window.removeEventListener('keydown', handlePhysicalKey);
  }, [guess, word, isGameOver]);

  return (
    <div className="app-container">
      <h1>Wordle-spelet</h1>

      <GameSetup onStart={fetchWord} />

      {word && (
        <>
          <Board
            guessHistory={guessHistory}
            currentGuess={guess}
            wordLength={word.length}
          />
          <CustomKeyboard
            onKeyPress={handleKeyPress}
            keyFeedback={keyFeedback}
          />
        </>
      )}

      {gameMessage && (
        <div className="game-message">
          <p>{gameMessage}</p>

          {hasWon && !isSubmitted && (
            <form
              className="highscore-form"
              onSubmit={(e) => {
                e.preventDefault();
                handleHighscoreSubmit();
              }}
            >
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Ditt namn"
              />
              <button type="submit">
                Spara highscore
              </button>
            </form>
          )}

          {isSubmitted && hasWon && 
            <p>Ditt resultat är sparat!</p>}
        </div>
      )}
    </div>
  );
}

export default Home;