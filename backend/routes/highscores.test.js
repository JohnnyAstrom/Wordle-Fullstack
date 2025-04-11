import request from 'supertest';
import express from 'express';
import path from 'path';
import highscoreRouter from './highscores.js';

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));
app.use(express.json());
app.use('/api/highscores', highscoreRouter);

describe('GET /api/highscores', () => {
  it('should render highscores page without crashing', async () => {
    const response = await request(app).get('/api/highscores');
    expect(response.statusCode).toBe(200);
    expect(response.text).toContain('<!DOCTYPE html');
  });

  it('should render filtered highscores with wordLength=5 and uniqueOnly=true', async () => {
    const response = await request(app).get(
      '/api/highscores?useTestData=true&wordLength=5&uniqueOnly=true'
    );
    expect(response.statusCode).toBe(200);
    expect(response.text).toContain('TestUser1');
    expect(response.text).not.toContain('TestUser99');
  });

  it('should render filtered highscores with wordLength=6 and timedMode=true', async () => {
    const response = await request(app).get(
      '/api/highscores?useTestData=true&wordLength=6&timedMode=true'
    );
    expect(response.statusCode).toBe(200);
    expect(response.text).toContain('TestUserWithTimer');
    expect(response.text).not.toContain('TestUserWithoutTimer');
  });

  it('should render empty table if no highscores match filter', async () => {
    const response = await request(app).get(
      '/api/highscores?wordLength=999'
    );
    expect(response.statusCode).toBe(200);
    expect(response.text).not.toContain('TestUser');
  });
});