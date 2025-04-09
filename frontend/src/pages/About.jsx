import React from 'react';
import './About.css';

function About() {
  return (
    <div className="about-container">
      <h1>Om projektet</h1>
      <p>
        Det här är ett Wordle-inspirerat spel byggt som en fullstack-applikation med React och Express.
      </p>
      <p>
        Spelet inkluderar feedback per bokstav, highscore-lista med filtrering och sortering, samt möjligheten att spela med tidtagning.
      </p>
      <p>
        Projektet är utvecklat som en inlämningsuppgift för kursen Avancerad Webbutveckling.
      </p>
    </div>
  );
}

export default About;