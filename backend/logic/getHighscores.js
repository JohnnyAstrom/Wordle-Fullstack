import fs from 'fs';
import path from 'path';

const defaultPath = path.resolve('data/highscores.json');

export function getHighscores(customPath = defaultPath) {
    const data = fs.readFileSync(customPath, 'utf8');
    return JSON.parse(data);
}
