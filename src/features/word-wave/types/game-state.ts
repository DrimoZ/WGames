// src/features/word-wave/types/game-state.ts

import type { GameMode } from "./game-mode";
import type { GameStatus } from "./game-status";
import type { LetterState } from "./letter-state";
import type { Tile } from "./tile";

export type GameState = {
    /**
     * The mode of the game, which can affect the rules and behavior of the game.
     * Either 'classic', 'hard', 'extreme' or 'endless'.
     */
    gameMode: GameMode;

    /**
     * The date when the game was started.
     * Format: YYYY-MM-DD.
     */
    gameDate: string;

    /**
     * The time when the game started, represented as a timestamp.
     * This is used to track how long the game has been running.
     */
    gameStartTime?: number;

    /**
     * The word that the player needs to guess.
     */
    wordToGuess: string | null;

    /**
     * The current state of the game board, represented as a 2D array of tiles.
     * Each tile contains information about the letter, its state, and position.
     */
    boardState: Tile[][];

    /**
     * The current row indice where the player is making their guess.
     */
    currentRow: number;

    /**
     * A message that can be displayed to the player, such as hints or errors.
     * This is optional and can be used to provide feedback to the player.
     */
    message?: string;

    /**
     * The current status of the game, which can be 'not-started', 'in-progress', 'completed' or 'failed'.
     * This is used to track the progress of the game and can be used for analytics.
     */
    gameStatus: GameStatus;

    /**
     * The current key states, which represent the state of each letter on the keyboard.
     * This is used to track which letters have been pressed and their states (e.g., correct, incorrect).
     * It is a record where the key is the letter and the value is its state.
     *
     * Should mayby be calculated from the board state instead of being stored separately,
     */
    keyStates: Record<string, LetterState>;

    /**
     * Timestamp of the last update to the game state.
     * This is used to determine if the game state is stale or needs to be refreshed.
     * It should be updated whenever the game state changes.
     */
    lastUpdate: number;
}