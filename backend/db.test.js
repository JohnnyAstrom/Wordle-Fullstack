import { getDb, closeDb } from './db.js';

describe('getDb', () => {
  test('ansluter till databasen och returnerar collections', async () => {
    const db = await getDb();
    const collections = await db.listCollections().toArray();

    expect(Array.isArray(collections)).toBe(true);
  });

  afterAll(async () => {
    await closeDb();
  });
});
