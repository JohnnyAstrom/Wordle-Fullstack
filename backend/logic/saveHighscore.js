import { getDb } from '../db.js';

export async function saveHighscore(
  name,
  wordLength,
  attempts,
  uniqueOnly,
  time,
  timedMode = false,
  insertFn = null
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

  if (insertFn) {
    await insertFn(entry);
  } else {
    const db = await getDb();
    const collection = db.collection('highscores');
    await collection.insertOne(entry);
  }

  return entry;
}