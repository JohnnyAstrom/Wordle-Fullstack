import { useState } from 'react';
import './App.css';
import FeedbackRow from '../components/FeedbackRow.jsx';
import GuessForm from '../components/GuessForm.jsx';
import GameSetup from '../components/GameSetup.jsx';
import GuessHistory from '../components/GuessHistory.jsx';

function App() {
  const [word, setWord] = useState(null);
  const [guess, setGuess] = useState('');
  const [feedback, setFeedback] = useState([]);
  const [guessHistory, setGuessHistory] = useState([]);
  const [gameMessage, setGameMessage] = useState('');
  const MAX_GUESSES = 6;

  async function fetchWord(wordLength, uniqueLetters) {
    try {
      const response = await fetch(`http://localhost:5080/api/game/start?length=${wordLength}&unique=${uniqueLetters}`);
      const data = await response.json();
      setWord(data.word);
      setGuess('')
      setFeedback([]);
      setGuessHistory([]);
      setGameMessage('');
    } catch (error) {
      console.error('Could not fetch word:', error);
    }
  }

  async function handleGuess() {
    if (!guess) return;

    if (guessHistory.length >= MAX_GUESSES) {
      setGameMessage(`Du har nått maximala antal gissningar (${MAX_GUESSES}). Spelet är över.`);
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

      if (newFeedback.every((item) => item.result === 'correct')) {
        setGameMessage(`Grattis! Du har gissat rätt ord. Det korrekta ordet var: ${word}`);
      } else if (guessHistory.length + 1 >= MAX_GUESSES) {
        setGameMessage(`Du har nått maximala antal gissningar. Det korrekta ordet var: ${word}`)
      }

      setGuess('');

    } catch (error) {
      console.error('Error while sending guess:', error);
      setGameMessage('Ett fel uppstod vid skickandet av din gissning');
    }
  }

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
        </>
      )}

      {guessHistory.length > 0 && (
        <GuessHistory
          guessHistory={guessHistory} />
      )}

      {feedback.length > 0 && (
        <div>
          <h3>Feedback</h3>
          <FeedbackRow
            feedback={feedback} />
        </div>
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