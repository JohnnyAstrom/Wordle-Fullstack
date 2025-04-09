export function filterAndSort(highscores, query) {
  const { wordLength, uniqueOnly, timedMode, sortBy, order } = query;
  let filtered = [...highscores];

  if (wordLength) {
    filtered = filtered.filter(score => score.wordLength === Number(wordLength));
  }

  if (uniqueOnly === 'true') {
    filtered = filtered.filter(score => score.uniqueOnly === true);
  }

  if (timedMode === 'true') {
    filtered = filtered.filter(score => score.timedMode === true);
  } else if (timedMode === 'false') {
    filtered = filtered.filter(score => score.timedMode === false);
  }

  if (sortBy) {
    const sortOrder = order === 'desc' ? 'desc' : 'asc';

    filtered.sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];

      if (sortBy === 'time') {
        aVal = aVal ?? Infinity;
        bVal = bVal ?? Infinity;
      }

      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }

  return filtered;
}

export function buildSortLink(column, currentSortBy, currentOrder, query) {
  const newOrder = currentSortBy === column && currentOrder === 'asc' ? 'desc' : 'asc';

  const preserved = Object.entries(query)
    .filter(([key]) => !['sortBy', 'order'].includes(key))
    .map(([key, val]) => `${key}=${val}`)
    .join('&');

  return `?sortBy=${column}&order=${newOrder}${preserved ? '&' + preserved : ''}`;
}