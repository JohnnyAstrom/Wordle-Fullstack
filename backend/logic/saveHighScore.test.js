import { saveHighscore } from './saveHighscore.js';
import { fn as jestFn } from 'jest-mock';

describe('saveHighscore (with injected insert function)', () => {
  it('should call insertFn with the highscore entry', async () => {
    const mockInsert = jestFn();

    const result = await saveHighscore(
      'TestUser',
      5,
      3,
      true,
      42,
      true,
      mockInsert
    );

    expect(mockInsert).toHaveBeenCalledWith(result);
    expect(result).toMatchObject({
      name: 'TestUser',
      wordLength: 5,
      attempts: 3,
      uniqueOnly: true,
      time: 42,
      timedMode: true
    });
    expect(typeof result.date).toBe('string');
  });
});