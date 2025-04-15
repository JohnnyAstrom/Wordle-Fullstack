import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

let client = new MongoClient(process.env.MONGODB_URI);

export async function getDb() {
  if (!client.topology?.isConnected()) {
    await client.connect();
  }
  return client.db('Wordle-Highscores');
}

export async function closeDb() {
  if (client) {
    await client.close();
    client = null;
  }
}