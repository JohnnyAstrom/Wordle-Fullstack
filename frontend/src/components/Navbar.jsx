import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/">Spelet</Link>
      <Link to="/settings">Inställningar</Link>
      <Link to="/about">Om</Link>
      <a href="http://localhost:5080/api/game/highscores" target="_blank">
        Highscores
      </a>
    </nav>
  );
}

export default Navbar;