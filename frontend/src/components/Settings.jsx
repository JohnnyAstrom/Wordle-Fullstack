import React from "react";
import "./Settings.css";

function SettingsPage({
  wordLength,
  setWordLength,
  uniqueOnly,
  setUniqueOnly,
  timedMode,
  setTimedMode
}) {
  const wordOptions = [5, 6, 7, 8];

  return (
    <>
      <div className="section">
        <h3>Antal bokstäver</h3>
        <div className="letter-buttons">
          {wordOptions.map((len) => (
            <button
              key={len}
              className={`letter-button ${wordLength === len ? "active" : ""}`}
              onClick={() => setWordLength(len)}
            >
              {len}
            </button>
          ))}
        </div>
      </div>

      <div className="section">
        <label className="toggle">
          <span>
            Endast unika bokstäver
            <small>Ordet får inte innehålla dubbla bokstäver</small>
          </span>
          <input
            type="checkbox"
            checked={uniqueOnly}
            onChange={(e) => setUniqueOnly(e.target.checked)}
          />
          <span className="slider" />
        </label>
      </div>

      <div className="section">
        <label className="toggle">
          <span>
            Spela med tidtagning
            <small>Tiden från start till vinst sparas</small>
          </span>
          <input
            type="checkbox"
            checked={timedMode}
            onChange={(e) => setTimedMode(e.target.checked)}
          />
          <span className="slider" />
        </label>
      </div>
    </>
  );
}

export default SettingsPage;
