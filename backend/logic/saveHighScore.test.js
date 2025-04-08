import fs from 'fs';
import path from 'path';
import { saveHighscore } from './saveHighscore.js';

const testPath = path.resolve('./data/test-save-highscores.json');

describe('saveHighscore', () => {
  afterEach(() => {
    if (fs.existsSync(testPath)) fs.unlinkSync(testPath);
  });

  it('should save a highscore object to a file and return it', () => {
    const entry = {
      name: 'TestUser',
      wordLength: 5,
      attempts: 4,
      uniqueOnly: false,
      time: 42
    };

    // Initialize the testfile with and empty array
    fs.writeFileSync(testPath, '[]');

    const result = saveHighscore(
      entry.name,
      entry.wordLength,
      entry.attempts,
      entry.uniqueOnly,
      entry.time,
      testPath
    );

    const contents = JSON.parse(fs.readFileSync(testPath, 'utf8'));

    expect(contents).toHaveLength(1);
    expect(contents[0].name).toBe('TestUser');
    expect(contents[0].attempts).toBe(4);
    expect(contents[0].uniqueOnly).toBe(false);
    expect(contents[0].time).toBe(42);
    expect(contents[0]).toHaveProperty('date');
    expect(result).toMatchObject(entry);
  });
});
