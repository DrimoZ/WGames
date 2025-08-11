// src/features/word-wave/utils/validate-guess.ts

import type { Tile } from "../types/tile";

/**
 * Validate a guess against the word to guess.
 * Returns a new Tile array with the correct, present, and absent states set.
 * @param guess The guess to validate.
 * @param wordToGuess The word to guess.
 */
export function validateGuess(guess: Tile[], wordToGuess: string): Tile[] {
    // Create a copy to avoid mutating the original array
    const result = [...guess];

    // First pass: Handle correct positions
    const wordCounts = countLetters(wordToGuess);
    const usedIndices = new Set<number>();

    for (let i = 0; i < guess.length; i++) {
        if (result[i].char === wordToGuess[i]) {
            result[i].state = 'correct';
            wordCounts[result[i].char]--;
            usedIndices.add(i);
        }
    }

    // Second pass: Handle present letters
    for (let i = 0; i < guess.length; i++) {
        if (result[i].state !== 'correct' && wordCounts[result[i].char] > 0) {
            result[i].state = 'present';
            wordCounts[result[i].char]--;
        }
    }

    // Mark remaining tiles as absent
    for (let i = 0; i < guess.length; i++) {
        if (!result[i].state) {
            result[i].state = 'absent';
        }
    }

    return result;
}

/**
 * Counts the occurrences of each character in a given word.
 *
 * @param word - The string for which character counts are to be calculated.
 * @returns An object where keys are characters and values are their respective counts in the word.
 */
function countLetters(word: string): Record<string, number> {
    return word.split('').reduce((acc, char) => {
        acc[char] = (acc[char] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);
}