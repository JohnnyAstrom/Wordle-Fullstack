import express from 'express';
import { evaluateGuess } from '../logic/evaluateGuess.js';
import { getRandomWord } from '../logic/getRandomWord.js';
import { saveHighscore } from '../logic/saveHighscore.js';
import { getHighscores } from '../logic/getHighscores.js';

const router = express.Router();

router.post('/guess', (req, res) => {
  const { guessedWord, correctWord } = req.body;

  if (!guessedWord || !correctWord) {
    return res.status(400).json({ error: 'guessedWord and correctWord are required' });
  }

  const feedback = evaluateGuess(guessedWord.toUpperCase(), correctWord.toUpperCase());
  res.json({ feedback });
});

router.get('/start', (req, res) => {
  const length = parseInt(req.query.length) || 5;
  const uniqueOnly = req.query.unique === 'true';

  const word = getRandomWord(length, uniqueOnly);
  if (!word) {
    return res.status(404).json({ error: 'No word found' });
  }

  res.json({ word });
});

router.post('/highscore', (req, res) => {
  const { name, wordLength, attempts } = req.body;

  if (!name || !attempts || !wordLength) {
    return res.status(400).json({ error: 'name, attempts and wordLength are required' });
  }

  const entry = saveHighscore(name, wordLength, attempts);
  res.status(201).json({ message: 'Highscore saved!', entry });
});

router.get('/highscores', (req, res) => {
  const highscores = getHighscores();
  highscores.sort((a, b) => a.attempts - b.attempts);
  res.render('highscores', { highscores });
});

export default router;
