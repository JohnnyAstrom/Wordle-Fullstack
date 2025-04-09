import fs from 'fs';
import path from 'path';

const defaultPath = path.resolve('./data/highscores.json');

export function saveHighscore(
  name,
  wordLength,
  attempts,
  uniqueOnly,
  time,
  filePath = defaultPath,
  timedMode = false
) {
  const entry = {
    name,
    wordLength,
    attempts,
    uniqueOnly,
    time,
    timedMode,
    date: new Date().toISOString()
  };

  let existing = [];

  if (fs.existsSync(filePath)) {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    existing = JSON.parse(fileContent);
  }

  existing.push(entry);

  fs.writeFileSync(filePath, JSON.stringify(existing, null, 2));

  return entry;
}
