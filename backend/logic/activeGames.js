import crypto from 'crypto';

const activeGame = new Map();

export function createGame(word, uniqueOnly) {
  const gameId = crypto.randomUUID();
  const startTime = Date.now();

  activeGame.set(gameId, {
    word,
    uniqueOnly,
    startTime
  });

  return gameId;
}

export function getGame(gameId) {
  return activeGame.get(gameId);
}

export function endGame(gameId) {
  const game = activeGame.get(gameId);
  if (!game) return null;

  const endTime = Date.now();
  const timeTaken = Math.floor((endTime - game.startTime) / 1000);
  return { ...game, timeTaken };
}