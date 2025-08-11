import { wordsClassic } from "../constants/words/classic";
import { wordsExtreme } from "../constants/words/extreme";
import { wordsHard } from "../constants/words/hard";
import type { GameMode } from "../types/game-mode";

const WORD_LISTS: Record<GameMode, string[]> = {
    classic: wordsClassic,
    hard: wordsHard,
    extreme: wordsExtreme,
    // endless: [...wordsClassic, ...wordsHard, ...wordsExtreme] // not used for daily
};

/**
 * Retrieves the word of the day for the specified game mode.
 *
 * This function generates a deterministic "daily word" based on the current
 * date and the selected game mode. It hashes the date and mode to produce
 * a consistent index for selecting a word from the predefined list of words
 * for each mode. The resulting word is converted to uppercase before being returned.
 *
 * @param mode The game mode for which to retrieve the daily word.
 * @returns The daily word in uppercase for the given game mode.
 */
export function getDailyWord(mode: GameMode): string {
    const today = new Date();
    const dateSeed = `${today.getUTCFullYear()}-${today.getUTCMonth()}-${today.getUTCDate()}`;

    // Create a hash based on the date and mode to ensure consistent word selection
    const hash = Array.from(dateSeed + mode)
        .reduce((acc, char) => acc + char.charCodeAt(0), 0);

    // Use the hash to index into the word list for the given mode
    const list = WORD_LISTS[mode];
    return list[hash % list.length].toUpperCase();
}
