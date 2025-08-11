import { useEffect, useState } from 'react';
import type { GameMode } from '../types/game-mode';
import { useGameState } from './use-game-state';
import type { GameState } from '../types/game-state';
import { validateGuess } from '../utils/validate-guess';
import { updateKeys } from '../utils/update-keys';
import type { LetterState } from '../types/letter-state';
import type { Tile } from '../types/tile';
import { valideDictionnary } from '../constants/words/valid';
import { MODE_CONFIG } from '../constants/mode-configs';


export function useWordWave(initialMode: GameMode = 'classic'): {
    gameState: GameState | null;
    board: GameState['boardState'];
    mode: GameState['gameMode'];
    keyStates: GameState['keyStates'];
    changeMode: (newMode: GameMode) => void;
    onKeyInput: (key: string) => void;
} {
    const { gameState, changeState, updateCurrentGameState } = useGameState(initialMode);

    const [mode, setMode] = useState<GameMode>(initialMode);

    useEffect(() => {
        if (!gameState && initialMode) {
        changeState(initialMode);
        }
    }, [initialMode, gameState, changeState]);

    // clear temporary messages after short delay
    useEffect(() => {
        const t = setTimeout(() => updateCurrentGameState({ message: '' }), 2500);
        return () => clearTimeout(t);
    }, [gameState?.message, updateCurrentGameState]);

    // Input validation helper
    const isValidKey = (key: string): boolean => {
        return /^[A-Z]$/.test(key);
    };

    // Secure row modification with immutable updates
    const updateRow = (
        rowIndex: number,
        tileIndex: number,
        newData: Partial<Tile>
    ): void => {
        if (!gameState?.boardState[rowIndex]) return;

        const newRow = [...gameState.boardState[rowIndex]];
        newRow[tileIndex] = { ...newRow[tileIndex], ...newData };

        updateCurrentGameState({
            boardState: [
                ...gameState!.boardState.slice(0, rowIndex),
                newRow,
                ...gameState!.boardState.slice(rowIndex + 1)
            ]
        } as Partial<GameState>);
    };

    /**
     * Changes the game mode to the specified new mode and updates the current game state accordingly.
     *
     * If the new mode is the same as the initial mode, the current game state is returned without changes.
     * Otherwise, it attempts to find an existing game state for the new mode and today's date in local storage.
     * If such a state exists, it is set as the current game state. If no existing state is found, a new game
     * state is created, set as the current game state, and saved to local storage.
     *
     * @param newMode The game mode to switch to.
     * @returns The updated current game state, or null if no state is available.
     */
    function changeMode(newMode: GameMode) {
        if (newMode === mode) return;
        setMode(newMode);
        changeState(newMode);
    }

    function onKeyInput(key: string) {
        if (!gameState) return;
        if (gameState.gameStatus === 'completed' || gameState.gameStatus === 'failed' ) return;

        // Handle key input logic here, e.g., updating the board, checking for win/loss conditions
        // This is a placeholder for the actual game logic that would be implemented

        switch (key) {
            case 'ENTER':
                submitRow();
                break;
            case 'BACK':
                removeLastKeyFromBoard();
                break;
            default:
                if (isValidKey(key)) writeKeyToBoard(key);
                break;
        }
    }

    function submitRow() {
        if (!gameState || (gameState.gameStatus !== 'in-progress' && gameState.gameStatus !== 'not-started')) return;

        const currentRow = gameState.currentRow;
        const guess = gameState.boardState[currentRow];

        // Check if the guess is valid
        if (!guess?.length || guess.some(tile => tile.char === '')) {
            updateCurrentGameState({
                message: 'Please enter a valid guess before submitting.'
            });
            return;
        }

        // Check if the word to guess is set
        const wordToGuess = gameState.wordToGuess;
        if (!wordToGuess) {
            updateCurrentGameState({
                message: 'No word to guess set.'
            });
            return;
        }

        // Check if guess is in dictionary
        if (!valideDictionnary.includes(guess.map(tile => tile.char).join('').toLowerCase())) {
            updateCurrentGameState({
                message: 'Word not in dictionary.'
            });
            return;
        }

        const validatedGuess = validateGuess(guess, wordToGuess);

        // Secure state updates with immutable patterns
        updateCurrentGameState({
            lastUpdate: Date.now(),
            gameStatus: 'in-progress',
            gameStartTime: gameState!.gameStartTime || Date.now(),
            currentRow: currentRow + 1,
            boardState: [
                ...gameState!.boardState.slice(0, currentRow),
                validatedGuess.map(tile => ({ ...tile, validated: true })),
                ...gameState!.boardState.slice(currentRow + 1)
            ],
            keyStates: updateKeys(gameState!.keyStates, validatedGuess),
            message: ''
        });

        // Check for win
        if (validatedGuess.every(tile => tile.state === 'correct')) {
            updateCurrentGameState({ gameStatus: 'completed', message: 'You win!' });
        }

        // Check for loss
        else if (currentRow >= MODE_CONFIG[mode].rows - 1) {
            updateCurrentGameState({ gameStatus: 'failed', message: 'You lose!' });
        }
    }

    /**
     * Writes a key to the current row on the board.
     *
     * This function checks if the game is in progress or not started. If the game state is valid,
     * it attempts to find the current row to write the key to. If the current row is not available,
     * an appropriate message is set. If the current row has an empty tile, the key is written to 
     * the first empty tile in the row, and the tile state is updated to 'filled'. If there are no
     * empty tiles in the current row, an appropriate message is set.
     *
     * @param key The key to write to the board.
     */
    function writeKeyToBoard(key: string) {
        if (!gameState || (gameState.gameStatus !== 'in-progress' && gameState.gameStatus !== 'not-started')) return;

        const currentRow = gameState.currentRow;
        const currentBoardRow = gameState.boardState[currentRow];

        if (!currentBoardRow) {
            updateCurrentGameState({
                message: 'No current row to write to.'
            });
            return;
        }

        const emptyTileIndex = currentBoardRow.findIndex(tile => tile.char === '');
        if (emptyTileIndex === -1) {
            updateCurrentGameState({
                message: 'No empty tiles in the current row.'
            });
            return;
        }

        updateRow(
            currentRow,
            emptyTileIndex,
            { char: key, state: 'filled' as LetterState }
        );
    }

    /**
     * Removes the last key from the current row on the board.
     * Does nothing if the game is not in progress or not started.
     * Does nothing if there is no current row to remove from.
     * Does nothing if there are no filled tiles in the current row.
     * Updates the game state with an appropriate message if any of the above conditions are not met.
     */
    function removeLastKeyFromBoard() {
        if (!gameState || (gameState.gameStatus !== 'in-progress' && gameState.gameStatus !== 'not-started')) return;

        const currentRow = gameState.currentRow;
        const currentBoardRow = gameState.boardState[currentRow];

        if (!currentBoardRow) {
            updateCurrentGameState({
                message: 'No current row to remove from.'
            });
            return;
        }

        const lastFilledTileIndex = currentBoardRow.findLastIndex((tile: Tile) =>
            tile.state === 'filled' && tile.char !== ''
        );

        if (lastFilledTileIndex === -1) {
            updateCurrentGameState({
                message: 'No filled tiles in the current row.'
            });
            return;
        }

        updateRow(
            currentRow,
            lastFilledTileIndex,
            { char: '', state: 'empty' as LetterState }
        );
    }

    return {
        gameState,
        board: gameState?.boardState || [],
        mode,
        keyStates: gameState?.keyStates || {},

        changeMode,
        onKeyInput
    };
}