import express from 'express';
import path from 'path';
import { evaluateGuess } from '../logic/evaluateGuess.js';
import { getRandomWord } from '../logic/getRandomWord.js';
import { saveHighscore } from '../logic/saveHighscore.js';
import { getHighscores } from '../logic/getHighscores.js';
import { createGame, getGame } from '../logic/activeGames.js';

const router = express.Router();

// POST /api/game/guess
router.post('/guess', (req, res) => {
  const { gameId, guessedWord } = req.body;

  if (!gameId || !guessedWord) {
    return res.status(400).json({ error: 'gameId och guessedWord krävs' });
  }

  const game = getGame(gameId);

  if (!game) {
    return res.status(404).json({ error: 'Spelet hittades inte' });
  }

  const feedback = evaluateGuess(guessedWord.toUpperCase(), game.word.toUpperCase());
  res.json({ feedback });
});

// POST /api/game/start
router.post('/start', (req, res) => {
  const { length, uniqueOnly } = req.body;
  const word = getRandomWord(length, uniqueOnly);

  if (!word) {
    return res.status(404).json({ error: 'Kunde inte hitta något ord' });
  }

  const gameId = createGame(word, uniqueOnly);

  res.status(200).json({ gameId, wordLength: word.length });
});

// POST /api/game/highscore
router.post('/highscore', (req, res) => {
  const { name, wordLength, attempts, uniqueOnly, time } = req.body;

  if (!name || !attempts || !wordLength) {
    return res.status(400).json({ error: 'Namn, antal försök och ordlängd krävs' });
  }

  const entry = saveHighscore(name, wordLength, attempts, uniqueOnly, time);
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