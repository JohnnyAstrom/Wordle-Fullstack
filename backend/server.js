import express from 'express';
import gameRouter from './routes/game.js';
import cors from 'cors';
import path from 'path';

const app = express();
const PORT = 5080;

app.use(express.json());
app.use(cors());

app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));

app.use('/api/game', gameRouter);

const publicPath = path.resolve('../frontend/public');
app.use(express.static(publicPath));

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});