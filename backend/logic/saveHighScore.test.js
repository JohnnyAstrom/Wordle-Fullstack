import { saveHighscore } from './saveHighscore.js';

describe('saveHighscore', () => {
  it('should return a new highscore object with name, wordLength, attempts and date', () => {
    const result = saveHighscore('TestPlayer', 5, 3);

    expect(result.name).toBe('TestPlayer');
    expect(result.wordLength).toBe(5);
    expect(result.attempts).toBe(3);
    expect(result).toHaveProperty('date');
    expect(typeof result.date).toBe('string');
  });
});