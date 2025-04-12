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
        The game gives real-time feedback on every guessed letter, includes a highscore list with filters and sorting, and offers an optional timed mode.
      </p>

      <h2>Key Features</h2>
      <ul>
      <li>Choose word length between 5 and 8 letters</li>
        <li>Option to play with only unique letters</li>
        <li>Option to play with timer to track how fast you solve the word</li>
        <li>Server-side word generation and feedback to prevent cheating</li>
        <li>Filterable and sortable highscore list with pagination</li>
        <li>Fully responsive layout for mobile and desktop</li>
        <li>Live deployment using <a href="https://wordle-fullstack-app.onrender.com/" target="_blank" rel="noreferrer">Render</a></li>
      </ul>

      <h2>Technologies Used</h2>
      <ul>
        <li>Frontend: React, Vite, React Router</li>
        <li>Backend: Express, Node.js</li>
        <li>Templating: EJS for server-side rendered highscores</li>
        <li>Styling: CSS</li>
        <li>Testing: Jest</li>
      </ul>

      <h2>Source Code</h2>
      <p>
        The full source code is available on <a href="https://github.com/JohnnyAstrom/wordle-fullstack" target="_blank">GitHub</a>
      </p>
    </div>
  );
}

export default About;