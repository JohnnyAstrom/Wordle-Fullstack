import { useState } from 'react';

function App() {
  const [word, setWord] = useState(null);
  
  async function fetchWord() {
    try {
      const response = await fetch('http://localhost:5080/api/game/start?length=5&unique=false');
      const data = await response.json();
      setWord(data.word);
    }
    catch (error) {
      console.error('Could not fetch word:', error);
    }
  }
    
  return (
    <div>
      <h1>Wordle-spelet</h1>
      <button onClick={fetchWord}>Starta nytt spel</button>

      {word && (
        <p>
          <strong>Hämtat ord: </strong> {word}
        </p>
      )}
    </div>
  );
}

export default App;