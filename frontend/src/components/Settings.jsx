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
        <h3>Number of Letters</h3>
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
            Only Unique Letters
            <small>The word cannot contain duplicate letters</small>
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
            Play with Timer
            <small>The time from start to win will be saved</small>
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