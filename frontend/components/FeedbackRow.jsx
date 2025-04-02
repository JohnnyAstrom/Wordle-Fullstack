import React from 'react';
import './FeedbackRow.css';

function FeedbackRow({ feedback }) {
  return (
    <div className="feedback-row">
      {feedback.map((item, index) => {
        let resultClass = '';
        if (item.result === 'correct') resultClass = 'correct';
        else if (item.result === 'misplaced') resultClass = 'misplaced';
        else if (item.result === 'incorrect') resultClass = 'incorrect';

        return (
          <div key={index} className={`feedback-box ${resultClass}`}>
            {item.letter.toUpperCase()}
          </div>
        );
      })}
    </div>
  );
}

export default FeedbackRow;

