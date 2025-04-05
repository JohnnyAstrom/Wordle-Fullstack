import fs from 'fs';
import path from 'path';

const defaultPath = path.resolve('./data/highscores.json');

export function saveHighscore(name, wordLength, attempts, filePath = defaultPath) {
  const entry = {
    name,
    wordLength,
    attempts,
    date: new Date().toISOString()
  };

  const existing = fs.existsSync(filePath)
    ? JSON.parse(fs.readFileSync(filePath, 'utf8'))
    : [];

  existing.push(entry);
  fs.writeFileSync(filePath, JSON.stringify(existing, null, 2));
  return entry;
}