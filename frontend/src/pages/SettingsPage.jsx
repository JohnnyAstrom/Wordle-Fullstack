import React from 'react';
import Settings from '../components/Settings';
import { useNavigate } from 'react-router-dom';
import './SettingsPage.css'; // om du har separat css

function SettingsPage({
  wordLength,
  setWordLength,
  uniqueOnly,
  setUniqueOnly,
  timedMode,
  setTimedMode
}) {
  const navigate = useNavigate();

  return (
    <div className="settings-wrapper">
      <div className="settings-container">
        <h1>Inställningar</h1>
        <Settings
          wordLength={wordLength}
          setWordLength={setWordLength}
          uniqueOnly={uniqueOnly}
          setUniqueOnly={setUniqueOnly}
          timedMode={timedMode}
          setTimedMode={setTimedMode}
        />
        <button onClick={() => navigate('/')} className="back-button">
          Tillbaka till spelet
        </button>
      </div>
    </div>
  );
}

export default SettingsPage;