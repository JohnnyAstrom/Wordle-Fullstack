import express from 'express';
import { getDb } from '../db.js';
import { filterAndSort, buildSortLink } from '../logic/filterAndSortHighscores.js';

export default function createHighscoreRouter(getHighscoresFn = null) {
  const router = express.Router();

  router.get('/', async (req, res) => {
    try {
      let highscores;

      // Använd testfunktion (tester)
      if (getHighscoresFn) {
        highscores = await getHighscoresFn();
      } else {
        const db = await getDb();
        const collection = db.collection('highscores');
        highscores = await collection.find({}).toArray();
      }

      // Filtrera och sortera baserat på query-parametrar
      const filteredHighscores = filterAndSort(highscores, req.query);

      // Paginering
      const pageSize = 10;
      const currentPage = Number(req.query.page) || 1;
      const totalPages = Math.ceil(filteredHighscores.length / pageSize);
      const startIndex = (currentPage - 1) * pageSize;
      const paginatedHighscores = filteredHighscores.slice(startIndex, startIndex + pageSize);

      // Rendera EJS sida med highscore data
      res.render('highscores', {
        highscores: paginatedHighscores,
        query: req.query,
        currentPage,
        totalPages,
        getSortLink: buildSortLink
      });

    } catch (err) {
      console.error('Fel vid hämtning av highscores:', err);
      res.status(500).send('Något gick fel vid databasanslutning.');
    }
  });

  return router;
}