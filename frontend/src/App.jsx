import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import SettingsPage from './pages/SettingsPage';
import RulesPage from './pages/RulesPage';
import Navbar from './components/Navbar';

function App() {
  const [wordLength, setWordLength] = useState(5);
  const [uniqueOnly, setUniqueOnly] = useState(false);
  const [timedMode, setTimedMode] = useState(false);

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={
          <Home
            wordLength={wordLength}
            uniqueOnly={uniqueOnly}
            timedMode={timedMode}
          />
        } />
        <Route path="/settings" element={
          <SettingsPage
            wordLength={wordLength}
            setWordLength={setWordLength}
            uniqueOnly={uniqueOnly}
            setUniqueOnly={setUniqueOnly}
            timedMode={timedMode}
            setTimedMode={setTimedMode}
          />
        } />
        <Route path="/about" element={<About />} />
        <Route path="/rules" element={<RulesPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;