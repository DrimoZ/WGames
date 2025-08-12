import { useEffect, useState } from "react";
import type { GameStats } from "../types/game-stats";
import { getLocalStorage, setLocalStorage } from "../../../services/local-storage";
import { MODES } from "../constants/mode-configs";
import type { GameMode } from "../types/game-mode";
import type { GameStatus } from "../types/game-status";

/**
 * Key for storing game stats in local storage.
 * This key is used to retrieve and save the game stats for all the modes.
 */
const LOCAL_STORAGE_KEY = 'word-wave:stats';

export function useGameStats(): {
    gameStats: GameStats[],
    addGameToStats: (gameMode: GameMode, gameDate: string, gameStatus: GameStatus, gameDuration: number, attempts: number) => void,
    getStatsForMode: (mode: GameMode) => GameStats
} {
    const [gameStats, setGameStats] = useState<GameStats[]>([]);

    useEffect(() => {
        const storedStats = getLocalStorage<GameStats[]>(LOCAL_STORAGE_KEY) || [];

        for (const mode of MODES) {
            const modeStats = storedStats.find((stat) => stat.gameMode === mode);

            if (!modeStats) {
                storedStats.push({
                    gameMode: mode,
                    currentStreak: 0,
                    isWinStreak: false,
                    history: [],
                });
            }
        }

        setGameStats(storedStats);
    }, []);

    useEffect(() => {
        setLocalStorage(LOCAL_STORAGE_KEY, gameStats);
    }, [gameStats]);

    /**
     * Adds a game to the game stats history.
     *
     * The game history for the given mode is updated with the given game data.
     * If the given mode does not already exist in the game stats history, it is added.
     * The current streak and isWinStreak values are updated if the game was won.
     *
     * @param gameMode The game mode to add the game to.
     * @param gameDate The date of the game in 'YYYY-MM-DD' format.
     * @param gameStatus The status of the game, either 'win' or 'loss'.
     * @param gameDuration The duration of the game in milliseconds.
     * @param attempts The number of guesses taken to complete the game.
     */
    function addGameToStats(
        gameMode: GameMode,
        gameDate: string,
        gameStatus: GameStatus,
        gameDuration: number,
        attempts: number
    ): void {
        setGameStats(prevStats => {
            // First check if a game with matching mode and date already exists
            const existingStat = prevStats.find(stat =>
                stat.gameMode === gameMode &&
                stat.history.some(game => game.gameDate === gameDate)
            );

            if (existingStat) {
            // Update existing game if found
            return prevStats.map(stat =>
                stat.gameMode === gameMode
                ? {
                    ...stat,
                    history: stat.history.map(game =>
                        game.gameDate === gameDate ? { gameDate, gameStatus, gameDuration, attempts } : game
                    ),
                    isWinStreak: gameStatus === 'completed' && stat.currentStreak > 0,
                    currentStreak: gameStatus === 'completed' ? stat.currentStreak + 1 : 0,
                } : stat
            );
            } else {
            // Add new game if not found
            return prevStats.some(stat => stat.gameMode === gameMode)
                ? prevStats.map(stat =>
                    stat.gameMode === gameMode
                    ? {
                        ...stat,
                        history: [...stat.history, { gameDate, gameStatus, gameDuration, attempts }],
                        isWinStreak: gameStatus === 'completed' && stat.currentStreak > 0,
                        currentStreak: gameStatus === 'completed' ? stat.currentStreak + 1 : 0,
                    } : stat
                ) : [
                    ...prevStats,
                    {
                        gameMode,
                        currentStreak: gameStatus === 'completed' ? 1 : 0,
                        isWinStreak: gameStatus === 'completed',
                        history: [{ gameDate, gameStatus, gameDuration, attempts }],
                    },
                ];
            }
        });
    }

    /**
     * Retrieves the game stats for the given mode.
     *
     * If the given mode does not exist in the game stats history, a new empty
     * stats entry is created and returned. Otherwise, the existing stats entry
     * is shallow copied and returned.
     *
     * @param mode The game mode to retrieve the stats for.
     * @returns The game stats for the given mode.
     */
    function getStatsForMode(mode: GameMode): GameStats {
        let modeStats = gameStats.find(stat => stat.gameMode === mode);

        if (!modeStats) {
            modeStats = {
                gameMode: mode,
                currentStreak: 0,
                isWinStreak: false,
                history: [],
            };
        }

        return {...modeStats};
    }

    return {
        gameStats,
        addGameToStats,
        getStatsForMode
    };
}