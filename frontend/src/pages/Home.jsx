import React, { useState, useEffect } from 'react';
import GameSetup from "../components/GameSetup.jsx";
import CustomKeyboard from "../components/CustomKeyboard.jsx";
import Board from "../components/Board.jsx";
import './Home.css';

function Home({ wordLength, uniqueOnly, timedMode }) {
  const [guess, setGuess] = useState('');
  const [guessHistory, setGuessHistory] = useState([]);
  const [gameMessage, setGameMessage] = useState('');
  const [usedLetters, setUsedLetters] = useState([]);
  const [keyFeedback, setKeyFeedback] = useState({});
  const [playerName, setPlayerName] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [hasWon, setHasWon] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [timeTaken, setTimeTaken] = useState(null);
  const [gameId, setGameId] = useState(null);

  const MAX_GUESSES = 6;

  async function fetchWord() {
    try {
      const response = await fetch('http://localhost:5080/api/game/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ length: wordLength, uniqueOnly })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Kunde inte starta nytt spel');

      setGameId(data.gameId);
      setGuess('');
      setGuessHistory([]);
      setUsedLetters([]);
      setGameMessage('');
      setKeyFeedback({});
      setPlayerName('');
      setIsSubmitted(false);
      setIsGameOver(false);
      setHasWon(false);
      if (timedMode) {
        setStartTime(Date.now());
      } else {
        setStartTime(null);
      }
      setTimeTaken(null);
    } catch (error) {
      console.error('Kunde inte starta nytt spel:', error);
      setGameMessage(error.message);
    }
  }

  async function handleGuess() {
    if (isGameOver || !guess || guess.length !== wordLength) return;

    if (guessHistory.length >= MAX_GUESSES) {
      setGameMessage(`Du har nått maximala antal gissningar (${MAX_GUESSES}).`);
      setIsGameOver(true);
      return;
    }

    try {
      const response = await fetch('http://localhost:5080/api/game/guess', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gameId, guessedWord: guess })
      });

      const result = await response.json();
      const newFeedback = result.feedback;

      const newGuess = { guess, feedback: newFeedback };
      const updatedHistory = guessHistory.concat(newGuess);
      setGuessHistory(updatedHistory);

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
        setGameMessage(`Du gissade rätt!`);
        setIsGameOver(true);
        setHasWon(true);
        if (timedMode && startTime) setTimeTaken(Math.floor((Date.now() - startTime) / 1000));
      } else if (updatedHistory.length >= MAX_GUESSES) {
        setGameMessage(`Du har använt alla försök.`);
        setIsGameOver(true);
      }

      const letters = guess.split('');
      setUsedLetters(usedLetters.concat(letters));
      setGuess('');
    } catch (error) {
      console.error('Error while sending guess:', error);
      setGameMessage('Ett fel uppstod vid skickandet av din gissning');
    }
  }

  async function handleHighscoreSubmit() {
    if (!playerName) {
      setGameMessage('Du måste skriva ett namn!');
      return;
    }

    try {
      const response = await fetch('http://localhost:5080/api/game/finish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gameId,
          name: playerName,
          wordLength,
          attempts: guessHistory.length,
          uniqueOnly,
          timedMode,
          time: timedMode ? timeTaken : undefined
        })
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

  const handleKeyPress = (key) => {
    if (isGameOver) return;

    if (key === 'BACKSPACE') {
      setGuess(guess.slice(0, -1));
    } else if (key === 'ENTER') {
      handleGuess();
    } else if (/^[A-ZÅÄÖ]$/.test(key)) {
      if (guess.length < wordLength) {
        setGuess(guess + key);
      }
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
  }, [guess, wordLength, isGameOver]);

  return (
    <div className="app-container">
      <h1>Wordle-spelet</h1>

      <GameSetup onStart={fetchWord} />

      {gameId && (
        <>
          <Board
            guessHistory={guessHistory}
            currentGuess={guess}
            wordLength={wordLength}
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

          {hasWon && timeTaken !== null && (
            <p>Din tid: {timeTaken} sekunder</p>
          )}

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
              <button type="submit">Spara highscore</button>
            </form>
          )}

          {isSubmitted && hasWon && <p>Ditt resultat är sparat!</p>}
        </div>
      )}
    </div>
  );
}

export default Home;