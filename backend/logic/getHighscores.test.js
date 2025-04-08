import fs from 'fs';
import path from 'path';
import { getHighscores } from './getHighscores.js';

const testPath = path.resolve('./data/test-highscores.json');

describe('getHighscores', () => {
  it('should return all highscores from the test file', () => {
    const highscores = getHighscores(testPath);

    expect(highscores.length).toBeGreaterThanOrEqual(3);

    const names = highscores.map(entry => entry.name);
    expect(names).toContain('TestUser1');
    expect(names).toContain('TestUser2');

    highscores.forEach(entry => {
      expect(entry).toHaveProperty('name');
      expect(entry).toHaveProperty('wordLength');
      expect(entry).toHaveProperty('attempts');
      expect(entry).toHaveProperty('uniqueOnly');
      expect(entry).toHaveProperty('date');
    });
  });

  it('should only return entries with wordLength = 6', () => {
    const highscores = getHighscores(testPath);
    const filtered = highscores.filter(entry => entry.wordLength === 6);

    filtered.forEach(entry => {
      expect(entry.wordLength).toBe(6);
    });
  });

  it('should only return entries with wordLength = 7', () => {
    const highscores = getHighscores(testPath);
    const filtered = highscores.filter(entry => entry.wordLength === 7);

    filtered.forEach(entry => {
      expect(entry.wordLength).toBe(7);
    });
  });

  it('should only return entries with wordLength = 8', () => {
    const highscores = getHighscores(testPath);
    const filtered = highscores.filter(entry => entry.wordLength === 8);

    filtered.forEach(entry => {
      expect(entry.wordLength).toBe(8);
    });
  });

  it('should only return entries where uniqueOnly = true', () => {
    const highscores = getHighscores(testPath);
    const filtered = highscores.filter(entry => entry.uniqueOnly === true);

    filtered.forEach(entry => {
      expect(entry.uniqueOnly).toBe(true);
    });
  });
});