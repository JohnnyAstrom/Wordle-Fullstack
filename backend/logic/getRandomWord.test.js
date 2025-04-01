import { getRandomWord } from './getRandomWord';
import { describe, expect, it } from '@jest/globals';

describe('getRandomWord', () => {
  it('should return a word with exactly 5 letters', () => {
    const word = getRandomWord(5, false);
    expect(word).toHaveLength(5);
  });

  it('should return a word with exactly 6 letters', () => {
    const word = getRandomWord(6, false);
    expect(word).toHaveLength(6);
  });

  it('should return a word with only unique letters', () => {
    const word = getRandomWord(5, true);
    const letters = word.split('');
    const uniqueLetters = new Set(letters);

    expect(letters.length).toBe(uniqueLetters.size);
  })
});