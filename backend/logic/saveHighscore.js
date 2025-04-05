export function saveHighscore(name, wordLength, attempts) {
  return {
    name,
    wordLength,
    attempts,
    date: new Date().toISOString(),
  };
}