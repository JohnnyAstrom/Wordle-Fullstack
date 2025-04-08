import request from 'supertest';
import express from 'express';
import path from 'path';
import gameRouter from './game.js';

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));

app.use(express.json());
app.use('/api/game', gameRouter);

describe('GET /start', () => {
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