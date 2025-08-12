import type { GameMode } from "./game-mode";
import type { GameStatus } from "./game-status";

export type GameStats = {
    gameMode: GameMode;

    currentStreak: number;
    isWinStreak: boolean;

    history: GameHistory[];
};

export type GameHistory = {
    gameDate: string;

    gameStatus: GameStatus;
    gameDuration: number;
    attempts: number;
};
