import { filterAndSort } from './filterAndSortHighscores.js';

describe('filterAndSort', () => {
  const highscores = [
    {
      name: 'TestUserWithTimer',
      attempts: 1,
      wordLength: 6,
      uniqueOnly: false,
      timedMode: true,
      time: 70,
    },
    {
      name: 'TestUserWithoutTimer',
      attempts: 3,
      wordLength: 6,
      uniqueOnly: false,
      timedMode: false,
      time: null,
    },
    {
      name: 'TestUser2',
      attempts: 2,
      wordLength: 7,
      uniqueOnly: true,
      timedMode: true,
      time: 80,
    },
  ];

  it('filters by wordLength = 6', () => {
    const result = filterAndSort(highscores, { wordLength: '6' });
    expect(result.map(s => s.name)).toEqual(['TestUserWithTimer', 'TestUserWithoutTimer']);
  });

  it('filters by uniqueOnly=true', () => {
    const result = filterAndSort(highscores, { uniqueOnly: 'true' });
    expect(result.map(s => s.name)).toEqual(['TestUser2']);
  });

  it('filters by timedMode=false', () => {
    const result = filterAndSort(highscores, { timedMode: 'false' });
    expect(result.map(s => s.name)).toEqual(['TestUserWithoutTimer']);
  });

  it('sorts by name ascending', () => {
    const result = filterAndSort(highscores, { sortBy: 'name', order: 'asc' });
    expect(result.map(s => s.name)).toEqual([
      'TestUser2',
      'TestUserWithTimer',
      'TestUserWithoutTimer',
    ]);
  });

  it('sorts by time ascending, nulls last', () => {
    const result = filterAndSort(highscores, { sortBy: 'time', order: 'asc' });
    expect(result.map(s => s.name)).toEqual(['TestUserWithTimer', 'TestUser2', 'TestUserWithoutTimer']);
  });
});