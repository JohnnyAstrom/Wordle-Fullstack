/*
Funktionen ska ta emot två strängar: guessedWord och correctWord.
Den ska returnera en array med ett objekt per bokstav i gissningen.

Varje objekt ska innehålla:
- letter: Själva bokstaven.
- result: Ett av följande värden:
  - "correct": bokstaven finns och är på rätt plats
  - "misplaced": bokstaven finns i correctWord men är på fel plats
  - "incorrect": bokstaven finns inte i correctWord

Viktigt:
- Bokstäver matchas i två steg:
  1. Först kontrolleras om bokstaven är på rätt plats ("correct")
  2. Om inte, kontrolleras om bokstaven finns någon annanstans i correctWord ("misplaced")

- En bokstav i correctWord får bara användas en gång. Exempelvis:
  Om det bara finns ett "L" i correctWord, ska bara ett "L" i guessedWord kunna få "correct" eller "misplaced".

Exempel:

guessedWord:  "H E L L O"
correctWord:  "C Y C L E"

Return:
[
  { letter: "H", result: "incorrect" },
  { letter: "E", result: "misplaced" },
  { letter: "L", result: "incorrect" },
  { letter: "L", result: "correct" },
  { letter: "O", result: "incorrect" }
]
*/

import { evaluateGuess } from './evaluateGuess.js';
import { describe, expect, it } from '@jest/globals';


describe('evaluateGuess', () => { 
 
 
  /****Testfall 1: Alla bokstäver är korrekta och på rätt plats****/
  
  it('should mark all letters as "correct" if all is on correct place', () => {
    const guessedWord = "ABCDE";
    const correctWord = "ABCDE";
    const result = evaluateGuess(guessedWord, correctWord);
    
    expect(result).toEqual([
      { letter: "A", result: "correct" },
      { letter: "B", result: "correct" },
      { letter: "C", result: "correct" },
      { letter: "D", result: "correct" },
      { letter: "E", result: "correct" }
    ]);
  });


  /****Testfall 2: Alla bokstäver är fel****/

  it('should mark all letters as "incorrect" if none är correct', () => {
    const guessedWord = "ABCDE";
    const correctWord = "FGHIJ";
    const result = evaluateGuess(guessedWord, correctWord);
      
    expect(result).toEqual([
      { letter: "A", result: "incorrect" },
      { letter: "B", result: "incorrect" },
      { letter: "C", result: "incorrect" },
      { letter: "D", result: "incorrect" },
      { letter: "E", result: "incorrect" }
    ]);
  })


  /****Testfall 3: Några bokstäver är korrekta och på rätt plats****/

  it('should mark correct letters on correct place as "correct" and the rest as "incorrect"', () => {
    const guessedWord = "ABCDE";
    const correctWord ="ABFGH";
    const result = evaluateGuess(guessedWord, correctWord);

    expect(result).toEqual([
      { letter: "A", result: "correct" },
      { letter: "B", result: "correct" },
      { letter: "C", result: "incorrect" },
      { letter: "D", result: "incorrect" },
      { letter: "E", result: "incorrect" }
    ]);
  })

  /****Testfall 4: Rätt bokstav på fel plats****/

  it('should mark all letters as "misplaced"', () => {
    const guessedWord = "ABCDE";
    const correctWord = "ECDAB";
    const result = evaluateGuess(guessedWord, correctWord);

    expect(result).toEqual([
      { letter: "A", result: "misplaced" },
      { letter: "B", result: "misplaced" },
      { letter: "C", result: "misplaced" },
      { letter: "D", result: "misplaced" },
      { letter: "E", result: "misplaced" }
    ]);
  });


  /****Testfall 5: Gissat ord innehåller dubletter av en bokstav där den första förekomsten av bokstaven är korrekt placerad****/

  it('should handle duplicate letters correctly when the first occurrence of the letter is correctly placed', () => {
    const guessedWord = "AABCD";
    const correctWord = "ACDEF";
    const result = evaluateGuess(guessedWord, correctWord);

    expect(result).toEqual([
      { letter: "A", result: "correct" },
      { letter: "A", result: "incorrect" },
      { letter: "B", result: "incorrect" },
      { letter: "C", result: "misplaced" },
      { letter: "D", result: "misplaced" }
    ]);
  });

  /****Testfall 6: Gissat ord  innehåller dubletter av en bokstav där den andra förekomsten av bokstaven är korrekt placerad.****/

  it('should handle duplicate letters correctly when the second occurrence of the same letter is correctly placed', () => {
    const guessedWord = "HELLO";
    const correctWord = "CYCLE";
    const result = evaluateGuess(guessedWord, correctWord);

    expect(result).toEqual([
      { letter: "H", result: "incorrect" },
      { letter: "E", result: "misplaced" },
      { letter: "L", result: "incorrect" },
      { letter: "L", result: "correct" },
      { letter: "O", result: "incorrect" }
    ]);
  });
});