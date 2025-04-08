import request from 'supertest';
import express from 'express';
import path from 'path';
import gameRouter from './game.js';
import { createGame } from '../logic/activeGames.js';

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));

app.use(express.json());
app.use('/api/game', gameRouter);

describe('GET /highscores', () => {
  it('should render highscores page without crashing', async () => {
    const response = await request(app).get('/api/game/highscores');

    expect(response.statusCode).toBe(200);
    expect(response.text).toContain('<!DOCTYPE html');
  });

  it('should render filtered highscores with wordLength=5 and uniqueOnly=true from test-highscore file', async () => {
    const response = await request(app).get(
      '/api/game/highscores?useTestData=true&wordLength=5&uniqueOnly=true'
    );

    expect(response.statusCode).toBe(200);
    expect(response.text).toContain('<!DOCTYPE html');
    expect(response.text).toContain('TestUser1');
    expect(response.text).not.toContain('TestUser99');
  });

  it('should render an empty table if no highscores match the filter', async () => {
    const response = await request(app).get(
      '/api/game/highscores?wordLength=999'
    );
  
    expect(response.statusCode).toBe(200);
    expect(response.text).toContain('<!DOCTYPE html');
    expect(response.text).not.toContain('TestUser');
  });
});

describe('POST /api/game/start', () => {
  it('should return a gameId and wordLength when starting a new game', async () => {
    const response = await request(app)
      .post('/api/game/start')
      .send({ length: 5, uniqueOnly: true });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('gameId');
    expect(typeof response.body.gameId).toBe('string');
    expect(response.body).toHaveProperty('wordLength', 5);
  });

  it('should return 404 if no word could be found', async () => {
    const response = await request(app)
      .post('/api/game/start')
      .send({ length: 99, uniqueOnly: true });

    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty('error');
  });
});

describe('POST /api/game/guess', () => {
  it('should return feedback when guessing a word with a valid gameId', async () => {
    const correctWord = 'APPLE';
    const gameId = createGame(correctWord);

    const response = await request(app)
      .post('/api/game/guess')
      .send({ gameId, guessedWord: 'ALERT' });

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body.feedback)).toBe(true);

    const letters = response.body.feedback.map(f => f.letter).join('');
    expect(letters).toBe('ALERT');
  });

  it('should return 404 if gameId is not found', async () => {
    const response = await request(app)
      .post('/api/game/guess')
      .send({ gameId: 'non-existent-id', guessedWord: 'ALERT' });

    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty('error');
  });

  it('should return 400 if required data is missing', async () => {
    const response = await request(app)
      .post('/api/game/guess')
      .send({ gameId: 'something' }); // saknar guessedWord

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('error');
  });
});
