import express from 'express';
import { evaluateGuess } from '../logic/evaluateGuess.js';
import { getRandomWord } from '../logic/getRandomWord.js';


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

  res.json({ word});
});

export default router;