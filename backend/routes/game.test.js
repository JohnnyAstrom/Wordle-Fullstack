import request from 'supertest';
import express from 'express';
import gameRouter from './game.js';

const app = express();
app.use(express.json());
app.use('/api/game', gameRouter);

describe('GET /api/game/start', () => {
  it('should return a 5-letter word when called with length=5&unique=false', async () => {
    const response = await request(app).get('/api/game/start?length=5&unique=false');

    expect(response.statusCode).toBe(200);
    expect(typeof response.body.word).toBe('string');
    expect(response.body.word).toHaveLength(5);
  });

  it('should return a 6-letter word with only unique letters when called with length=6&unique=true', async () => {
    const response = await request(app).get('/api/game/start?length=6&unique=true');

    const word = response.body.word;
    const letters = word.split('');
    const uniqueLetters = new Set(letters);

    expect(response.statusCode).toBe(200);
    expect(typeof word).toBe('string');
    expect(word).toHaveLength(6);
    expect(letters.length).toBe(uniqueLetters.size);
  });
});