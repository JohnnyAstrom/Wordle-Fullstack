import express from 'express';
import { evaluateGuess } from '../logic/evaluateGuess.js';
import { getRandomWord } from '../logic/getRandomWord.js';
import { createGame, getGame, endGame } from '../logic/activeGames.js';

export default function createGameRouter(saveHighscoreFn) {
  const router = express.Router();

  // Start a new game
  router.post('/start', (req, res) => {
    const { length, uniqueOnly } = req.body;
    const word = getRandomWord(length, uniqueOnly);

    if (!word) {
      return res.status(404).json({ error: 'Kunde inte hitta något ord' });
    }

    const gameId = createGame(word, uniqueOnly);
    res.status(200).json({ gameId, wordLength: word.length });
  });

  // Guess a word
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

  // End game and save
  router.post('/finish', async (req, res) => {
    const { gameId, name, attempts, wordLength, uniqueOnly, timedMode } = req.body;

    if (!gameId || !name || !attempts || !wordLength) {
      return res.status(400).json({ error: 'gameId, name, attempts och wordLength krävs' });
    }

    const result = endGame(gameId);
    if (!result) {
      return res.status(404).json({ error: 'Spelet hittades inte' });
    }

    const finalTime = timedMode ? result.timeTaken : null;

    try {
      const entry = await saveHighscoreFn(
        name,
        wordLength,
        attempts,
        uniqueOnly,
        finalTime,
        timedMode
      );

      res.status(201).json({ message: 'Highscore sparat!', entry });
    } catch (err) {
      console.error('Fel vid sparande:', err);
      res.status(500).json({ error: 'Ett internt fel uppstod vid sparande' });
    }
  });

  return router;
}