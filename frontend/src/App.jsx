import { useState } from 'react';
import './App.css';
import FeedbackRow from '../components/FeedbackRow.jsx';
import GuessForm from '../components/GuessForm.jsx';
import GameSetup from '../components/GameSetup.jsx';

function App() {
  const [word, setWord] = useState(null);
  const [guess, setGuess] = useState('');
  const [feedback, setFeedback] = useState([]);

  async function fetchWord() {
    try {
      const response = await fetch('http://localhost:5080/api/game/start?length=5&unique=false');
      const data = await response.json();
      setWord(data.word);
      setGuess('');
      setFeedback([]);
    } catch (error) {
      console.error('Could not fetch word:', error);
    }
  }

  async function handleGuess() {
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
      setFeedback(result.feedback);
    } catch (error) {
      console.error('Error while sending guess:', error);
    }
  }

  return (
    <div className="app-container">
      <h1>Wordle-spelet</h1>
      <GameSetup
        onStart={fetchWord}
        wordLength={word?.length}
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

      {feedback.length > 0 && (
        <div>
          <h3>Feedback</h3>
          <FeedbackRow feedback={feedback} />
        </div>
      )}
    </div>
  );
}

export default App;