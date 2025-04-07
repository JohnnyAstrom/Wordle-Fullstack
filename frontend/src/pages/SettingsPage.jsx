import React from 'react';
import Settings from '../components/Settings';
import { useNavigate } from 'react-router-dom';

function SettingsPage({ wordLength, setWordLength, uniqueOnly, setUniqueOnly }) {
  const navigate = useNavigate();

  return (
    <div>
      <h2>Inställningar</h2>
      <Settings
        wordLength={wordLength}
        setWordLength={setWordLength}
        uniqueOnly={uniqueOnly}
        setUniqueOnly={setUniqueOnly}
      />
      <button onClick={() => navigate('/')}>Tillbaka till spelet</button>
    </div>
  );
}

export default SettingsPage;