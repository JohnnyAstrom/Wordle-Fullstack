import fs from 'fs';
import path from 'path';
import { getHighscores } from './getHighscores.js';

const testPath = path.resolve('./data/test-highscores.json');

describe('getHighscores', () => {
  beforeEach(() => {
    const testData = [
      {
        name: 'TestPlayer1',
        wordLength: 5,
        attempts: 4,
        date: '2024-01-01T12:00:00Z'
      },
      {
        name: 'TestPlayer2',
        wordLength: 5,
        attempts: 3,
        date: '2024-01-02T12:00:00Z'
      },
      {
        name: 'TestPlayer3',
        wordLength: 5,
        attempts: 2,
        date: '2024-01-03T12:00:00Z'
      }
    ];

    fs.writeFileSync(testPath, JSON.stringify(testData));;
  });

  afterEach(() => {
    if (fs.existsSync(testPath)) fs.unlinkSync(testPath);
  });

  it('should read and return an array of highscores from file', () => {
    const highscores = getHighscores(testPath);

    expect(highscores).toHaveLength(3);
    expect(highscores[0].name).toBe('TestPlayer1');
    expect(highscores[1].wordLength).toBe(5);
    expect(highscores[2].attempts).toBe(2);
    expect(highscores[0].date).toBe('2024-01-01T12:00:00Z');
  });
});