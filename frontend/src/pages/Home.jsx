import React, { useState, useEffect } from 'react';

// Import custom components and styling
import GameSetup from "../components/GameSetup.jsx";
import CustomKeyboard from "../components/CustomKeyboard.jsx";
import Board from "../components/Board.jsx";
import './Home.css';

function Home({ wordLength, uniqueOnly, timedMode }) {
  // State variables for different parts of the game
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
  const [correctWord, setCorrectWord] = useState(null);

  const MAX_GUESSES = 6; // Maximum number of allowed guesses

  // Start a new game by asking the backend for a word
  async function fetchWord() {
    try {
      const response = await fetch(`/api/game/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ length: wordLength, uniqueOnly })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Could not start new game');

      // Reset all game state
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
      setStartTime(timedMode ? Date.now() : null);
      setTimeTaken(null);
    } catch (error) {
      console.error('Could not start new game:', error);
      setGameMessage(error.message);
    }
  }

  // Handle when the user submits a guess
  async function handleGuess() {
    // Stop if game is over, or guess is empty or wrong length
    if (isGameOver || !guess || guess.length !== wordLength) return;

    // Stop if the user already made the maximum number of guesses
    if (guessHistory.length >= MAX_GUESSES) {
      setGameMessage(`You have reached the maximum number of guesses (${MAX_GUESSES}).`);
      setIsGameOver(true);
      return;
    }

    try {
      // Send the guess to the backend
      const response = await fetch(`/api/game/guess`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gameId, guessedWord: guess })
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Invalid guess');

      // Will be shown if the user loses
      if (result.correctWord) {
        setCorrectWord(result.correctWord); 
      }

      const newFeedback = result.feedback;

      // Add the new guess to the guess history
      const newGuess = { guess, feedback: newFeedback };
      const updatedHistory = guessHistory.concat(newGuess);
      setGuessHistory(updatedHistory);

      // Update the keyboard feedback (colors)
      const updatedKeyFeedback = { ...keyFeedback };
      newFeedback.forEach(({ letter, result }) => {
        const current = updatedKeyFeedback[letter];

        // Do not replace "correct" with anything else
        if (current === 'correct') return;
        // Do not replace "misplaced" with "wrong"
        if (current === 'misplaced' && result === 'wrong') return;

        updatedKeyFeedback[letter] = result;
      });
      setKeyFeedback(updatedKeyFeedback);

      // Check if the guess was completely correct
      if (newFeedback.every((item) => item.result === 'correct')) {
        setGameMessage(`You guessed correctly! 😊`);
        setIsGameOver(true);
        setHasWon(true);
        if (timedMode && startTime) {
          const timeInSeconds = Math.floor((Date.now() - startTime) / 1000);
          setTimeTaken(timeInSeconds);
        }
      } else if (updatedHistory.length >= MAX_GUESSES) {
        setGameMessage(`No attempts left. 😞`);
        setIsGameOver(true);
      }

      // Mark all guessed letters as "used"
      const letters = guess.split('');
      setUsedLetters(usedLetters.concat(letters));
      setGuess('');
    } catch (error) {
      console.error('Error while sending guess:', error);
      setGameMessage(error.message || 'An error occurred while submitting your guess');
    }
  }

  // Handle submitting the highscore to the backend
  async function handleHighscoreSubmit() {
    if (!playerName) {
      setGameMessage('You must enter a name!');
      return;
    }

    try {
      const response = await fetch(`/api/game/finish`, {
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
        setGameMessage('Could not save highscore.');
      }
    } catch (error) {
      console.error('Network error:', error);
      setGameMessage('Network error while saving highscore.');
    }
  }

  // Handles clicks on the custom on-screen keyboard
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

  // Listen to physical keyboard (only when not typing in an input)
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

  // What gets displayed on the page
  return (
    <div className="app-container">
      <h1>Wordle Game</h1>

      <GameSetup onStart={fetchWord} />

      {gameId && (
        <>
          <div className="game-area">
            <Board
              key={gameId}
              guessHistory={guessHistory}
              currentGuess={guess}
              wordLength={wordLength}
            />
          </div>

          <CustomKeyboard
            onKeyPress={handleKeyPress}
            keyFeedback={keyFeedback}
          />
        </>
      )}

      {gameMessage && (
        <div className="game-message">
          <p>{gameMessage}</p>

          {/* Show time if the user won and timer is enabled */}
          {hasWon && timeTaken !== null && (
            <p>Your time: {timeTaken} seconds</p>
          )}

          {/* Show form to submit highscore */}
          {hasWon && !isSubmitted && (
            <form
              className="highscore-form"
              onSubmit={(e) => {
                e.preventDefault();
                handleHighscoreSubmit();
              }}
            >
              <div className="save-highscore-container">
                <input
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="Your name"
                />
                <button className="submit-button" type="submit">Save highscore</button>
              </div>
            </form>
          )}

          {/* Message after highscore is saved */}
          {isSubmitted && hasWon && <p>Well done! Your highscore is saved.</p>}

          {/* Show correct word if the player lost */}
          {!hasWon && isGameOver && correctWord && (
            <p>The correct word was: <strong>{correctWord.toUpperCase()}</strong></p>
          )}
        </div>
      )}
    </div>
  );
}

export default Home;
