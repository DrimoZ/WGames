// src/features/word-wave/utils/validate-guess.ts

import type { Tile } from "../types/tile";

/**
 * Validates a given guess against a word to guess.
 *
 * For each tile in the guess, this function determines if the letter is
 * present in the word to guess, and if so, whether it is in the correct
 * position. The tile's state is then updated accordingly.
 *
 * The function returns the original guess with the updated state for
 * each tile.
 *
 * @param guess The guess to validate.
 * @param wordToGuess The word to validate the guess against.
 * @returns The validated guess with each tile's state updated.
 */
export function validateGuess(guess: Tile[], wordToGuess: string): Tile[] {
    const wordArray = wordToGuess.split("");

    for (let i = 0; i < guess.length; i++) {
        guess[i].state = "empty";

        const index = wordArray.indexOf(guess[i].char);

        if (index === i) {
            guess[i].state = "correct";
            wordArray[index] = "";
        }else if (wordToGuess.includes(guess[i].char)) {
            guess[i].state = "present";
        } else {
            guess[i].state = "absent";
        }
    }

    return guess;
}
