import React from 'react';
import { useNavigate } from 'react-router-dom';
import './RulesPage.css';

const RulesPage = () => {
  const navigate = useNavigate();

  return (
    <div className="rules-wrapper">
      <div className="rules-container">
        <h1>How to Play</h1>
        <ul>
          <li>For each guess, try to figure out the correct word by guessing a combination of letters.</li>
          <li>Green means the correct letter in the correct position.</li>
          <li>Yellow means the correct letter in the wrong position.</li>
          <li>Gray means the letter is incorrect.</li>
          <li>Try to guess the word in as few attempts as possible!</li>
        </ul>

        <div className="example">
          <p>Examples</p>
          <div className="word-example">
            <div className="tile green">W</div>
            <div className="tile">O</div>
            <div className="tile">R</div>
            <div className="tile">R</div>
            <div className="tile">Y</div>
            <span><strong>W</strong> is in the word and in the correct spot.</span>
          </div>
          <div className="word-example">
            <div className="tile">L</div>
            <div className="tile orange">I</div>
            <div className="tile">G</div>
            <div className="tile">H</div>
            <div className="tile">T</div>
            <span><strong>I</strong> is in the word but in the wrong spot.</span>
          </div>
          <div className="word-example">
            <div className="tile">A</div>
            <div className="tile">P</div>
            <div className="tile">P</div>
            <div className="tile gray">L</div>
    
            <div className="tile">E</div>
            <span><strong>L</strong> is not in the word at all.</span>
          </div>
        </div>

        <button onClick={() => navigate('/')} className="back-button">
          Back to Game
        </button>
      </div>
    </div>
  );
};

export default RulesPage;