import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import SettingsPage from './pages/SettingsPage';
import Navbar from './components/Navbar';

function App() {
  const [wordLength, setWordLength] = useState(5);
  const [uniqueOnly, setUniqueOnly] = useState(false);

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={
          <Home
            wordLength={wordLength}
            uniqueOnly={uniqueOnly}
          />
        } />
        <Route path="/settings" element={
          <SettingsPage
            wordLength={wordLength}
            setWordLength={setWordLength}
            uniqueOnly={uniqueOnly}
            setUniqueOnly={setUniqueOnly}
          />
        } />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;