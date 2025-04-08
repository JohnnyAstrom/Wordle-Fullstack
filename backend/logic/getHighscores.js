import fs from 'fs';
import path from 'path';

const defaultPath = path.resolve('./data/highscores.json');

export function getHighscores(filePath = defaultPath) {
  if (!fs.existsSync(filePath)) return [];

  const content = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(content);
}