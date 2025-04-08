import { createGame, getGame } from './activeGames.js';

describe('createGame', () => {
  it('should create and store a game with word and uniqueOnly', () => {
    const gameId = createGame('HELLO', true);
    const game = getGame(gameId);

    expect(game).toBeDefined();
    expect(game.word).toBe('HELLO');
    expect(game.uniqueOnly).toBe(true);
    expect(typeof game.startTime).toBe('number');
  });
});