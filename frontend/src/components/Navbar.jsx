import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/">Play</Link>
      <a href="http://localhost:5080/highscores">
        Highscores
      </a>
      <Link to="/rules">How to Play</Link>
      <Link to="/about">About</Link>
      <Link to="/settings">Settings</Link>
    </nav>
  );
}

export default Navbar;