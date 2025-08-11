import type { LetterState } from "../types/letter-state";
import type { Tile } from "../types/tile";

/**
 * Updates a given key state object with the given validated tiles.
 *
 * This function will update the key state object with the highest state
 * possible for each key. If a key is not present in the object, it will
 * be added with the state of the tile. If a key is already present in the
 * object, its state will be updated if the tile's state is higher than the
 * current state. The order of states is: absent, present, correct.
 *
 * @param keyStates The key state object to update.
 * @param validatedTiles The validated tiles to update the key state object with.
 * @returns The updated key state object.
 */
export function updateKeys(
    keyStates: Record<string, LetterState>,
    validatedTiles: Tile[],
): Record<string, LetterState> {
    const updatedKeyStates = { ...keyStates };

    for (const tile of validatedTiles) {
        const char = tile.char.toLowerCase();
        if (!updatedKeyStates[char] || updatedKeyStates[char] === 'empty') {
            updatedKeyStates[char] = tile.state;
        } else if (tile.state === 'correct') {
            updatedKeyStates[char] = 'correct';
        } else if (tile.state === 'present' && updatedKeyStates[char] !== 'correct') {
            updatedKeyStates[char] = 'present';
        }
    }

    return updatedKeyStates;
}