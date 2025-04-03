import React from 'react';
import FeedbackRow from './FeedbackRow';

function GuessHistory({ guessHistory }) {
  return (
    <div className="GuessHistory.css">
      <h3>Gissningshistorik</h3>
      {guessHistory.map((item, index) => (
        <div key={index}>
          <FeedbackRow feedback={item.feedback} />
        </div>
      ))}
    </div>
  );
}

export default GuessHistory;