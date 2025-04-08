import express from 'express';
import path from 'path';
import { evaluateGuess } from '../logic/evaluateGuess.js';
import { getRandomWord } from '../logic/getRandomWord.js';
import { saveHighscore } from '../logic/saveHighscore.js';
import { getHighscores } from '../logic/getHighscores.js';

const router = express.Router();

// POST /api/game/guess
router.post('/guess', (req, res) => {
  const { guessedWord, correctWord } = req.body;

  if (!guessedWord || !correctWord) {
    return res.status(400).json({ error: 'Du måste skicka med både guessedWord och correctWord' });
  }

  const feedback = evaluateGuess(guessedWord.toUpperCase(), correctWord.toUpperCase());
  res.json({ feedback });
});

// GET /api/game/start
router.get('/start', (req, res) => {
  const length = req.query.length ? parseInt(req.query.length) : 5;
  const uniqueOnly = req.query.unique === 'true';
  const word = getRandomWord(length, uniqueOnly);

  if (!word) {
    return res.status(404).json({ error: 'Kunde inte hitta något ord med de kriterierna' });
  }

  res.json({ word });
});

// POST /api/game/highscore
router.post('/highscore', (req, res) => {
  const { name, wordLength, attempts, uniqueOnly } = req.body;

  if (!name || !attempts || !wordLength) {
    return res.status(400).json({ error: 'Namn, antal försök och ordlängd krävs' });
  }

  const entry = saveHighscore(name, wordLength, attempts, uniqueOnly);
  res.status(201).json({ message: 'Highscore sparat!', entry });
});

// GET /api/game/highscores (SSR)
router.get('/highscores', (req, res) => {
  let filePath;

  if (req.query.useTestData === 'true') {
    filePath = path.resolve('./data/test-highscores.json');
  } else {
    filePath = path.resolve('./data/highscores.json');
  }

  let highscores = getHighscores(filePath);

  const wordLength = req.query.wordLength;
  if (wordLength) {
    highscores = highscores.filter(score => score.wordLength === Number(wordLength));
  }

  const uniqueOnly = req.query.uniqueOnly;
  if (uniqueOnly === 'true') {
    highscores = highscores.filter(score => score.uniqueOnly === true);
  }

  res.render('highscores', { highscores });
});

export default router;