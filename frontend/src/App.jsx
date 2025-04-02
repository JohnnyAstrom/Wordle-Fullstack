import { useState } from 'react';

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
    <div>
      <h1>Wordle-spelet</h1>

      <button onClick={fetchWord}>Starta nytt spel</button>

      {word && (
        <>
          <p>Ordets längd: {word.length}</p>

          <input
            type="text"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            placeholder="Skriv din gissning"
            maxLength={word.length}
          />

          <button onClick={handleGuess} disabled={!guess || !word}>
            Gissa
          </button>
        </>
      )}
      {feedback.length > 0 && (
        <div>
          <h3>Feedback</h3>
          <ul>
            {feedback.map((item, index) => (
              <li key={index}>
                {item.letter}: {item.result}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;