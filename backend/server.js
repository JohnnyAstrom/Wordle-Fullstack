import express from 'express';
import expressLayouts from 'express-ejs-layouts';
import createGameRouter from './routes/game.js';
import createHighscoreRouter from './routes/highscores.js';
import { saveHighscore } from './logic/saveHighscore.js';
import { getDb } from './db.js';
import cors from 'cors';
import path from 'path';

const app = express();
const PORT = 5080;

app.use(express.json());
app.use(cors());
app.use(expressLayouts);

app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));
app.set('layout', 'layout');

app.use('/api/game', createGameRouter(saveHighscore));
app.use('/highscores', createHighscoreRouter(async () => {
  const db = await getDb();
  return await db.collection('highscores').find({}).toArray();
}));

const publicPath = path.resolve('../frontend/dist');
app.use(express.static(publicPath));

app.get(['/rules', '/about', '/settings', '/'], (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
