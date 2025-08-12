import { useState, useEffect } from 'react';
import type { GameState } from '../types/game-state';
import type { GameMode } from '../types/game-mode';
import { getLocalStorage, setLocalStorage } from '../../../services/local-storage';
import { MODE_CONFIG, MODES } from '../constants/mode-configs';
import { getDailyWord } from '../utils/get-daily-word';

/**
 * Key for storing game states in local storage.
 * This key is used to retrieve and save the game state for the current mode and date.
 */
const LOCAL_STORAGE_KEY = 'word-wave:states';

/**
 * A React hook that manages the game state for Word Wave.
 *
 * The hook will automatically load the current game state from local storage
 * when the component mounts, and save the state to local storage whenever
 * the state is updated. If there is no existing state for the current mode and
 * date, a new game state will be created.
 *
 * @param initialMode The game mode to start the game with. Defaults to 'classic'.
 * @returns An object with two properties: `gameState` and `updateGameState`.
 *   `gameState` is the current game state, and `updateGameState` is a function
 *   that can be used to update the game state.
 */
export function useGameState(initialMode: GameMode = 'classic'): {
    gameState: GameState | null,
    updateCurrentGameState: (updatedState: Partial<GameState>) => GameState | null,
    changeState: (newMode: GameMode) => GameState | null
} {
    const [currentGameState, setGameState] = useState<GameState | null>(null);

    /**
     * Saves the current game state to local storage.
     * This function is called whenever the game state is updated.
     */
    useEffect(() => {
        const allStates = getLocalStorage<GameState[]>(LOCAL_STORAGE_KEY) || [];
        const todayDate = todayKeyDate();
        const statesForToday: GameState[] = [];

        for (const mode of MODES) {
            const existingModeState = allStates.find(state => state.gameMode === mode && state.gameDate === todayDate);

            // If there's an existing state for the mode and today, use it
            if (existingModeState) {
                statesForToday.push(existingModeState);
            }

            // If no state exists for today, start a new game
            else {
                console.log(`No state found for mode ${mode} and date ${todayDate}. Starting a new game.`);
                statesForToday.push(createNewGameState(mode));
            }

            // If mode is initialMode, set it as the current game state
            if (mode === initialMode && !currentGameState) {
                setGameState(createNewGameState(mode));
            }
        }

        setLocalStorage(LOCAL_STORAGE_KEY, statesForToday);
    }, [ initialMode, currentGameState ]);

    /**
     * Creates a new game state for the given mode. The state is initialized with
     * the word to guess, the game config, the current row, and all other state
     * properties set to their default values.
     *
     * @param mode The game mode for which to create the new state.
     * @returns The newly created game state.
     */
    function createNewGameState(mode: GameMode): GameState {
        const pickedWord = getDailyWord(mode);
        const config = MODE_CONFIG[mode];

        return {
            gameMode: mode,
            gameDate: todayKeyDate(),
            wordToGuess: pickedWord,
            boardState: Array(config.rows).fill(Array(config.wordLength).fill({ char: '', state: 'empty' })),
            currentRow: 0,
            gameStatus: 'not-started',
            keyStates: {},
            lastUpdate: Date.now(),
        };
    }

    /**
     * Updates the current game state with the given partial state.
     * If the current game state is null, this function does nothing.
     * Otherwise, it merges the given partial state with the current state
     * and updates the `currentGameState` state variable with the new state.
     * The updated state is then saved to local storage.
     *
     * @param updatedState The partial state to merge with the current state.
     * @return The updated game state, or null if the current game state was null.
     */
    function updateCurrentGameState(updatedState: Partial<GameState>): GameState | null {
        if (currentGameState) {
            const newState = { ...currentGameState, ...updatedState};
            setGameState(newState);

            // Save the updated state to local storage
            const allStates = getLocalStorage<GameState[]>(LOCAL_STORAGE_KEY) || [];
            const existingIndex = allStates.findIndex(state => state.gameMode === newState.gameMode && state.gameDate === newState.gameDate);

            if (existingIndex !== -1) {
                allStates[existingIndex] = newState;
            } else {
                allStates.push(newState);
            }

            setLocalStorage(LOCAL_STORAGE_KEY, allStates);
        }

        return currentGameState;
    }

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
    function changeState(newMode: GameMode): GameState | null {
        if (newMode === currentGameState?.gameMode) return currentGameState;

        // Find the existing game state for the new mode
        const allStates = getLocalStorage<GameState[]>(LOCAL_STORAGE_KEY) || [];
        const todayDate = todayKeyDate();
        const existingIndex = allStates.findIndex(state => state.gameMode === newMode && state.gameDate === todayDate);

        if (existingIndex !== -1) {
            // If an existing state is found, set it as the current game state
            setGameState(allStates[existingIndex]);
        } else {
            // If no existing state is found, create a new game state
            const newState = createNewGameState(newMode);
            setGameState(newState);
            allStates.push(newState);
            setLocalStorage(LOCAL_STORAGE_KEY, allStates);
        }

        return currentGameState;
    }

    return {
        gameState: currentGameState,
        updateCurrentGameState,
        changeState
    };
}

/**
 * Returns a string representing the date, in the format 'YYYY-MM-DD',
 * that can be used as a key in local storage.
 *
 * @param date The date to format. If not provided, the current date is used.
 * @returns A string in the format 'YYYY-MM-DD'.
 */
function todayKeyDate(date = new Date()): string {
    return date.toISOString().slice(0, 10);
}