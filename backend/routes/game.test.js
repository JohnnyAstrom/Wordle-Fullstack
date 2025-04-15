import request from 'supertest';
import express from 'express';
import path from 'path';
import { createGame } from '../logic/activeGames.js';
import createGameRouter from './game.js';
import { fn as jestFn } from 'jest-mock';

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));
app.use(express.json());

// Mockad saveHighscore-funktion
const mockSaveHighscore = jestFn(async (name, wordLength, attempts, uniqueOnly, time, timedMode) => {
  return {
    name,
    wordLength,
    attempts,
    uniqueOnly,
    time,
    timedMode,
    date: new Date().toISOString()
  };
});

// Använd router med mockad saveHighscore
app.use('/api/game', createGameRouter(mockSaveHighscore));

describe('POST /api/game/start', () => {
  it('should return a gameId and wordLength when starting a new game', async () => {
    const res = await request(app)
      .post('/api/game/start')
      .send({ length: 5, uniqueOnly: true });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('gameId');
    expect(typeof res.body.gameId).toBe('string');
    expect(res.body).toHaveProperty('wordLength', 5);
  });

  it('should return 404 if no word could be found', async () => {
    const res = await request(app)
      .post('/api/game/start')
      .send({ length: 99, uniqueOnly: true });

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('error');
  });
});

describe('POST /api/game/guess', () => {
  it('should return feedback when guessing a word with a valid gameId', async () => {
    const correctWord = 'APPLE';
    const gameId = createGame(correctWord);

    const res = await request(app)
      .post('/api/game/guess')
      .send({ gameId, guessedWord: 'ALERT' });

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.feedback)).toBe(true);

    const letters = res.body.feedback.map(f => f.letter).join('');
    expect(letters).toBe('ALERT');
  });

  it('should return 404 if gameId is not found', async () => {
    const res = await request(app)
      .post('/api/game/guess')
      .send({ gameId: 'non-existent-id', guessedWord: 'ALERT' });

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('error');
  });

  it('should return 400 if required data is missing', async () => {
    const res = await request(app)
      .post('/api/game/guess')
      .send({ gameId: 'something' });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });
});

describe('POST /api/game/finish', () => {
  it('should end the game and return highscore entry with time', async () => {
    const word = 'APPLE';
    const gameId = createGame(word);

    await new Promise((resolve) => {
      const t = setTimeout(resolve, 1000);
      t.unref?.();
    });

    const res = await request(app)
      .post('/api/game/finish')
      .send({
        gameId,
        name: 'TestUser',
        attempts: 3,
        wordLength: word.length,
        uniqueOnly: true,
        timedMode: true
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('message', 'Highscore sparat!');
    expect(res.body.entry).toMatchObject({
      name: 'TestUser',
      attempts: 3,
      wordLength: word.length,
      uniqueOnly: true,
      timedMode: true
    });
    expect(typeof res.body.entry.time).toBe('number');
    expect(res.body.entry.time).toBeGreaterThan(0);
  });
});