export function getRandomWord(length, uniqueOnly) {
  const wordList = [
    'apple', 'grape', 'peach', 'berry', 'melon',
    'mango', 'lemon', 'cherry', 'orange', 'banana'
  ];

  const filteredWords = wordList.filter(word => {
    if (word.length !== length) return false;
    if (uniqueOnly && hasDuplicates(word)) return false;
    return true;
  });

  const randomIndex = Math.floor(Math.random() * filteredWords.length);
  return filteredWords[randomIndex];
}

function hasDuplicates(word) {
  const letters = word.split('');
  const uniqueLetters = new Set(letters);
  return uniqueLetters.size !== letters.length;
}