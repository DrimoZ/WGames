import { writeFile } from 'fs/promises';
import { wordsExtreme } from './extreme.ts';

/**
 * Filters words by length and converts to lowercase
 * @param words - Array of words to process
 * @param minLength - Minimum length to include (inclusive)
 * @param maxLength - Maximum length to include (inclusive)
 * @returns New array with filtered and transformed words
 */
function filterWordsByLength(words, minLength, maxLength) {
    return words
        .filter(word => word.length >= minLength && word.length <= maxLength)
        .map(word => word.toLowerCase());
}

/**
 * Writes the filtered words to a new file
 * @param words - Array of words to write
 * @param outputPath - Path to write the file
 */
async function writeWordsToFile(words, outputPath) {
    const content = `export const wordsClassic = [\n${words.map(word => `    "${word}",`).join('\n')}\n];`;
    await writeFile(outputPath, content, 'utf8');
}

// Example usage
async function main() {
    const minLength = 9;
    const maxLength = 9;
    const filteredWords = filterWordsByLength(wordsExtreme, minLength, maxLength);
    // Write to new file
    await writeWordsToFile(filteredWords, `./src/features/word-wave/constants/words/filtered-${minLength}-${maxLength}.ts`);
}

main().catch(console.error);