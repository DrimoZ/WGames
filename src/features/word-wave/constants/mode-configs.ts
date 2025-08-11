import type { GameConfig } from "../types/game-config";
import type { GameMode } from "../types/game-mode";

/**
 * Configuration for each game mode.
 * Each mode has specific rules such as word length, number of rows, and whether all letters are revealed.
 */
export const MODE_CONFIG: Record<GameMode, GameConfig> = {
    classic: {
        wordLength: 5,
        rows: 6,
        revealAll: true
    },
    hard: {
        wordLength: 7,
        rows: 6,
        revealAll: true
    },
    extreme: {
        wordLength: 9,
        rows: 6,
        revealAll: false
    },
    // endless: {
    //     wordLength: -1, // -1 indicates no limit
    //     rows: 6,
    //     revealAll: true
    // },
};

/**
 * Default game mode to be used when no specific mode is provided.
 * This is typically set to 'classic' for a standard game experience.
 */
export const DEFAULT_MODE: GameMode = "classic";

/**
 * List of all available game modes.
 * This is used to iterate through modes and for UI elements that allow mode selection.
 */
export const MODES: GameMode[] = Object.keys(MODE_CONFIG) as GameMode[];

/**
 * Names of the game modes for display purposes.
 * This provides a user-friendly name for each mode, which can be used in UI elements.
 */
export const MODE_NAMES: Record<GameMode, string> = {
    classic: "Classic",
    hard: "Hard",
    extreme: "Extreme",
    // endless: "Endless"
};