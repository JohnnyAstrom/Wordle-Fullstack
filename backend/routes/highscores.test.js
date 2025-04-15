import request from 'supertest';
import express from 'express';
import path from 'path';
import createHighscoreRouter from './highscores.js';

const testData = [
  {
    name: 'TestUser1',
    wordLength: 5,
    attempts: 4,
    uniqueOnly: true,
    timedMode: false,
    date: '2025-04-01'
  },
  {
    name: 'TestUserWithTimer',
    wordLength: 6,
    attempts: 3,
    uniqueOnly: false,
    timedMode: true,
    date: '2025-04-02'
  },
  {
    name: 'TestUser99',
    wordLength: 4,
    attempts: 6,
    uniqueOnly: false,
    timedMode: false,
    date: '2025-04-03'
  }
];

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));
app.use(express.json());
app.use('/api/highscores', createHighscoreRouter(() => Promise.resolve(testData)));

describe('GET /api/highscores (via parameter)', () => {
  it('ska rendera utan krascher', async () => {
    const res = await request(app).get('/api/highscores');
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain('<!DOCTYPE html');
  });

  it('ska visa bara användare med wordLength=5 och uniqueOnly=true', async () => {
    const res = await request(app).get('/api/highscores?wordLength=5&uniqueOnly=true');
    expect(res.text).toContain('TestUser1');
    expect(res.text).not.toContain('TestUserWithTimer');
    expect(res.text).not.toContain('TestUser99');
  });

  it('ska visa användare med timedMode=true', async () => {
    const res = await request(app).get('/api/highscores?timedMode=true');
    expect(res.text).toContain('TestUserWithTimer');
    expect(res.text).not.toContain('TestUser1');
    expect(res.text).not.toContain('TestUser99');
  });

  it('ska visa tomt resultat om ingen matchar', async () => {
    const res = await request(app).get('/api/highscores?wordLength=999');
    expect(res.text).not.toContain('TestUser');
  });
});
