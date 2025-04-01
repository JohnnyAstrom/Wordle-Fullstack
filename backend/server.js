import express from 'express';
import gameRouter from './routes/game.js';

const app = express();
const PORT = 5080;

app.use(express.json());

app.use('/api/game', gameRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
