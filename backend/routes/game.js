import express from 'express';
import path from 'path';
import { evaluateGuess } from '../logic/evaluateGuess.js';
import { getRandomWord } from '../logic/getRandomWord.js';
import { saveHighscore } from '../logic/saveHighscore.js';
import { createGame, getGame, endGame } from '../logic/activeGames.js';

const router = express.Router();

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

  game.guesses = game.guesses || [];
  game.guesses.push(guessedWord);

  const MAX_GUESSES = 6;
  const hasLost = game.guesses.length >= MAX_GUESSES && !feedback.every(f => f.result === 'correct');

  res.json({
    feedback,
    correctWord: hasLost ? game.word : undefined
  });
});

// POST /api/game/finish
router.post('/finish', (req, res) => {
  const { gameId, name, attempts, wordLength, uniqueOnly, timedMode, useTestPath } = req.body;

  if (!gameId || !name || !attempts || !wordLength) {
    return res.status(400).json({ error: 'gameId, name, attempts och wordLength krävs' });
  }

  const result = endGame(gameId);
  if (!result) {
    return res.status(404).json({ error: 'Spelet hittades inte' });
  }

  const finalTime = timedMode ? result.timeTaken : null;
  const filePath = useTestPath
    ? path.resolve('./data/test-save-highscores.json')
    : path.resolve('./data/highscores.json');

  try {
    const entry = saveHighscore(
      name,
      wordLength,
      attempts,
      uniqueOnly,
      finalTime,
      filePath,
      timedMode
    );

    res.status(201).json({ message: 'Highscore sparat!', entry });
  } catch (err) {
    res.status(500).json({ error: 'Ett internt fel uppstod vid sparande' });
  }
});

export default router;