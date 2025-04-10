import React from 'react';
import './About.css';

function About() {
  return (
    <div className="about-container">
      <h1>About the Project</h1>
      <p>
        This is a Wordle-inspired game built as a full-stack application using React and Express.
      </p>
      <p>
        The game includes letter-by-letter feedback, a highscore list with filtering and sorting, as well as the option to play with a timer.
      </p>
      <p>
        The project was developed as a submission for the Advanced Web Development course.
      </p>
    </div>
  );
}

export default About;
