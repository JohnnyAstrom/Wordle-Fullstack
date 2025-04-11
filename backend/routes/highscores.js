import express from 'express';
import path from 'path';
import { getHighscores } from '../logic/getHighscores.js';
import { filterAndSort, buildSortLink } from '../logic/filterAndSortHighscores.js';

const router = express.Router();

// GET /api/highscores
router.get('/', (req, res) => {
  const filePath = req.query.useTestData === 'true'
    ? path.resolve('./data/test-highscores.json')
    : path.resolve('./data/highscores.json');

  const highscores = getHighscores(filePath);
  const filteredHighscores = filterAndSort(highscores, req.query);

  // Paginering
  const pageSize = 10;
  const currentPage = Number(req.query.page) || 1;
  const totalPages = Math.ceil(filteredHighscores.length / pageSize);

  const startIndex = (currentPage - 1) * pageSize;
  const paginatedHighscores = filteredHighscores.slice(startIndex, startIndex + pageSize);

  res.render('highscores', {
    highscores: paginatedHighscores,
    query: req.query,
    currentPage,
    totalPages,
    getSortLink: buildSortLink
  });
});

export default router;