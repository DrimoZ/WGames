// src/features/word-wave/hooks/use-word-wave.ts

import { useEffect, useMemo, useState } from 'react';
import type { GameMode } from '../types/game-mode';
import type { GameConfig } from '../types/game-config';
import { MODE_CONFIG } from '../constants/mode-configs';
import type { Tile } from '../types/tile';
import type { LetterState } from '../types/letter-state';
import { getLocalStorage, setLocalStorage } from '../../../services/local-storage';
import type { GameState } from '../types/game-state';
import { evaluateGuess, pickDailyWordFromDictionnary } from '../utils/get-daily-word';

function storageKeyFor(mode: GameMode, dateStr: string) {
    return `${mode}:${dateStr}`;
}

function todayKeyDate(date = new Date()) {
    return date.toISOString().slice(0, 10);
}

export default function useWordWave(initialMode: GameMode = 'classic') {
    const [mode, setMode] = useState<GameMode>(initialMode);
    const [secret, setSecret] = useState<string>('');
    const [config, setConfig] = useState<GameConfig>(MODE_CONFIG[initialMode]);
    const [board, setBoard] = useState<Tile[][]>([]);
    const [row, setRow] = useState(0);
    const [col, setCol] = useState(0);
    const [message, setMessage] = useState('');
    const [keyStates, setKeyStates] = useState<Record<string, LetterState>>({});
    const [won, setWon] = useState(false);
    const [lost, setLost] = useState(false);
    const [revealedRow, setRevealedRow] = useState<number | null>(null); // which row is currently revealed (for extreme)

    const today = useMemo(() => todayKeyDate(), []);

    /** internal helpers */
    function makeEmptyBoard(length: number, rows: number): Tile[][] {
        return Array.from({ length: rows }, () =>
        Array.from({ length }, () => ({ char: '', state: 'empty' as LetterState }))
        );
    }

    function persistState(state: GameState): void {
        try {
            const key = storageKeyFor(mode, today);
            setLocalStorage(key, state);
        } catch (e) {
            console.error('Failed to persist game state:', e);
        }
    }

    function loadStateIfAny(): GameState | null {
        try {
            const key = storageKeyFor(mode, today);
            const raw = getLocalStorage<GameState>(key);

            if (!raw) return null;
            return raw;
        } catch {
            return null;
        }
    }

    function startNewGame(forMode: GameMode) {
        const pickedWord = pickDailyWordFromDictionnary(forMode);
        const pickedWordLength = pickedWord.length;
        const gameConfig = { ...MODE_CONFIG[forMode], wordLength: pickedWordLength };

        setMode(forMode);
        setSecret(pickedWord);
        setConfig(gameConfig);
        setBoard(makeEmptyBoard(gameConfig.wordLength, gameConfig.rows));
        setRow(0);
        setCol(0);
        setMessage('');
        setKeyStates({});
        setWon(false);
        setLost(false);
        setRevealedRow(null);

        // persist empty state
        persistState({
            secret: pickedWord,
            board: makeEmptyBoard(gameConfig.wordLength, gameConfig.rows),
            row: 0,
            col: 0,
            keyStates: {},
            won: false,
            lost: false,
        });
    }

    // initialize on first mount or when mode changes
    useEffect(() => {
        const loadedGameState: GameState | null = loadStateIfAny();

        if (loadedGameState) {
            // restore only if the stored secret matches today's pick (it should)
            setSecret(loadedGameState.secret || pickDailyWordFromDictionnary(mode));
            setConfig({ ...MODE_CONFIG[mode], wordLength: (loadedGameState.secret || pickDailyWordFromDictionnary(mode)).length });
            setBoard(loadedGameState.board || makeEmptyBoard(MODE_CONFIG[mode].wordLength, MODE_CONFIG[mode].rows));
            setRow(loadedGameState.row || 0);
            setCol(loadedGameState.col || 0);
            setKeyStates(loadedGameState.keyStates || {});
            setWon(!!loadedGameState.won);
            setLost(!!loadedGameState.lost);
            setRevealedRow(loadedGameState.revealedRow ?? null);
        } else {
            startNewGame(mode);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mode]);

    // clear temporary messages after short delay
    useEffect(() => {
        if (!message) return;
        const t = setTimeout(() => setMessage(''), 2500);
        return () => clearTimeout(t);
    }, [message]);

    /** update board immutably */
    function setTile(r: number, c: number, char: string, state: LetterState = 'filled') {
        setBoard((prev) => {
            const copy = prev.map((rr) => rr.map((t) => ({ ...t })));
            copy[r][c] = { char, state };
            return copy;
        });
    }

    /** Input handling */
    function onKey(key: string) {
        if (won || lost) return;
        if (key === 'BACK') {
            if (col === 0) return;

            setTile(row, col - 1, '');
            setCol((c) => Math.max(0, c - 1));
            return;
        }

        if (key === 'ENTER') {
            submit();
            return;
        }

        if (/^[A-Z]$/i.test(key)) {
            const ch = key.toLowerCase();
            if (col >= config.wordLength) return;

            setTile(row, col, ch);
            setCol((c) => c + 1);
        }
    }

    /** Submit a row */
    function submit() {
        const current = board[row];
        if (!current) return;

        // require full row
        if (current.some((t) => t.char === '')) {
            setMessage('Complete the word before submitting.');
            return;
        }

        // guess evaluation
        const guess = current.map((t) => t.char).join('');
        const evalRes = evaluateGuess(guess, secret);

        // update states depending on mode
        if (mode === 'extreme') {
            // only reveal this row: set its final states, and set revealedRow to this row.
            setBoard((prev) => {
                const copy = prev.map((r) => r.map((c) => ({ ...c })));
                // set states for this row
                copy[row] = evalRes.results.map((r) => ({ char: r.char, state: r.state }));
                // earlier rows stay with letters but 'filled' state (no color)
                for (let rIdx = 0; rIdx < row; rIdx++) {
                    copy[rIdx] = copy[rIdx].map((t) => ({ char: t.char, state: t.char ? 'filled' : 'empty' }));
                }
                return copy;
            });

            setRevealedRow(row);
        } else {
            // reveal all previous attempts (classic behavior)
            setBoard((prev) => {
                const copy = prev.map((r) => r.map((c) => ({ ...c })));
                copy[row] = evalRes.results.map((r) => ({ char: r.char, state: r.state }));
                return copy;
            });

            // in non-extreme we might set revealedRow to null or to row for animation; store null
            setRevealedRow(null);
        }

        // update key states (preserve best-known)
        setKeyStates((prev) => {
            const next = { ...prev };
            evalRes.results.forEach((r) => {
                const existing = next[r.char];
                // order of precedence: correct > present > absent
                if (existing === 'correct') return;
                if (existing === 'present' && r.state === 'absent') return;

                next[r.char] = r.state;
            });

            return next;
        });

        // check win/lose
        const isWin = evalRes.results.every((r) => r.state === 'correct');

        if (isWin) {
            setWon(true);
            setMessage('Nice! You won Word Wave.');
        } else if (row >= config.rows - 1) {
            setLost(true);
            setMessage(`Out of tries — The word was ${secret.toUpperCase()}`);
        } else {
            setRow((r) => r + 1);
            setCol(0);
        }

        // persist
        persistState({
            secret,
            board: (() => {
                let b: Tile[][] = [];

                setBoard((prev) => {
                    b = prev.map((rr) => rr.map((c) => ({ ...c })));
                    return prev;
                });

                return b;
            })(),
            row: isWin ? row : Math.min(config.rows - 1, row + (isWin ? 0 : 1)),
            col: 0,
            keyStates,
            won: isWin,
            lost: !isWin && row >= config.rows - 1,
            revealedRow: mode === 'extreme' ? row : null,
        });
    }

    function reset() {
        startNewGame(mode);
    }

    function changeMode(newMode: GameMode) {
        // ignore if same
        if (newMode === mode) return;
        
        // discard saved state for previous mode and start new
        setMode(newMode);
        startNewGame(newMode);
    }

    return {
        mode,
        changeMode,
        board,
        row,
        col,
        config,
        onKey,
        message,
        keyStates,
        reset,
        won,
        lost,
        secret,
        revealedRow,
    };
}
