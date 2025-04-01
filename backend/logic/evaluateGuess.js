export function evaluateGuess(guessedWord, correctWord) {
  const result = [];
  let usedCorrectLetters = [];

  // Första loopen: Markera korrekta bokstäver
  for (let i = 0; i < guessedWord.length; i++) {
    const letter = guessedWord[i];
    const correctLetter = correctWord[i];

    // Kontrollera om bokstaven är på rätt plats ("correct")
    if (letter === correctLetter) {
      result.push({ letter, result: "correct" });
      usedCorrectLetters.push(letter);
    } else {
      result.push({ letter, result: "incorrect" }); // Markera som "incorrect" initialt
    }
  }
  // Andra loopen: Markera de bokstäver som finns men inte på rätt plats ("misplaced")
  for (let i = 0; i < guessedWord.length; i++) {
    const letter = guessedWord[i];

    // Om bokstaven inte redan är markerad som "correct" eller "incorrect"...
    if (result[i].result === "incorrect" && correctWord.includes(letter) && !usedCorrectLetters.includes(letter)) {
      result[i].result = "misplaced"; 
      usedCorrectLetters.push(letter);
    }
  }

  return result;
}