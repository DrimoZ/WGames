// src/features/word-wave/hooks/use-word-wave.tsx

import { useEffect, useState } from 'react';
import WORDS from '../constants/words';

type TileState = 'empty' | 'filled' | 'correct' | 'present' | 'absent';

type Tile = { letter: string; state: TileState };

const ROWS = 6;
const COLS = 5;

function emptyBoard(): Tile[][] {
    return Array.from({ length: ROWS }, () =>
        Array.from({ length: COLS }, () => ({ letter: '', state: 'empty' as TileState }))
    );
}

function chooseWord(): string {
    const w = WORDS[Math.floor(Math.random() * WORDS.length)];
    return w.toLowerCase();
}

export default function useWordWave() {
    const [board, setBoard] = useState<Tile[][]>(emptyBoard);
    const [currentRow, setCurrentRow] = useState(0);
    const [currentCol, setCurrentCol] = useState(0);
    const [message, setMessage] = useState<string>('');
    const [keyStates, setKeyStates] = useState<Record<string, TileState>>({});
    const [secret, setSecret] = useState<string>(() => chooseWord());
    const [won, setWon] = useState(false);
    const [lost, setLost] = useState(false);

    // allow resetting externally
    const resetGame = () => {
        setBoard(emptyBoard());
        setCurrentRow(0);
        setCurrentCol(0);
        setMessage('');
        setKeyStates({});
        setSecret(chooseWord());
        setWon(false);
        setLost(false);
    };

    useEffect(() => {
        // clear temporary messages after a moment
        if (!message) return;
        const t = setTimeout(() => setMessage(''), 2400);
        return () => clearTimeout(t);
    }, [message]);

    // helper to set tile immutably
    const setTile = (row: number, col: number, tile: Tile) => {
        setBoard((prev) => {
        const copy = prev.map((r) => r.map((c) => ({ ...c })));
        copy[row][col] = tile;
        return copy;
        });
    };

    const onKey = (key: string) => {
        if (won || lost) return;
        if (key === 'BACK') {
            if (currentCol === 0) return;
            setTile(currentRow, currentCol - 1, { letter: '', state: 'empty' });
            setCurrentCol((c) => Math.max(0, c - 1));
            return;
        }
        if (key === 'ENTER') {
            submitRow();
            return;
        }
        if (/^[A-Z]$/i.test(key) && currentCol < COLS) {
            setTile(currentRow, currentCol, { letter: key.toLowerCase(), state: 'filled' });
            setCurrentCol((c) => Math.min(COLS, c + 1));
        }
    };

    const submitRow = () => {
        const row = board[currentRow];
        if (row.some((t) => t.letter === '')) {
            setMessage('Complete the row before submitting.');
            return;
        }

        const guess = row.map((t) => t.letter).join('');
        // we allow any 5-letter string in this demo; else validate against word list
        // Evaluate result
        const resultStates: TileState[] = Array(COLS).fill('absent');
        const secretArr = secret.split('');
        const guessArr = guess.split('');

        // First pass: correct letters
        const secretTaken = Array(COLS).fill(false);
        for (let i = 0; i < COLS; i++) {
            if (guessArr[i] === secretArr[i]) {
                resultStates[i] = 'correct';
                secretTaken[i] = true;
            }
        }

        // Second pass: present letters (accounting for duplicates)
        for (let i = 0; i < COLS; i++) {
            if (resultStates[i] === 'correct') continue;
            const idx = secretArr.findIndex((ch, j) => ch === guessArr[i] && !secretTaken[j]);

            if (idx !== -1) {
                resultStates[i] = 'present';
                secretTaken[idx] = true;
            } else {
                resultStates[i] = 'absent';
            }
        }

        // Set tile states with slight delays handled by Board reveal logic (we just set states now)
        setBoard((prev) => {
            const copy = prev.map((r) => r.map((c) => ({ ...c })));
            copy[currentRow] = copy[currentRow].map((t, i) => ({
                ...t,
                state: resultStates[i],
            }));
            return copy;
        });

        // Update key states (correct > present > absent order)
        setKeyStates((prev) => {
            const next = { ...prev };

            guessArr.forEach((letter, i) => {
                const st = resultStates[i];
                const existing = next[letter];
                if (existing === 'correct') return; // keep best
                if (existing === 'present' && st === 'absent') return;
                next[letter] = st;
            });

            return next;
        });

        // Win / lose
        const isWin = resultStates.every((s) => s === 'correct');
        if (isWin) {
            setWon(true);
            setMessage('Nice! You rode the Word Wave.');
            return;
        }

        if (currentRow >= ROWS - 1) {
            setLost(true);
            setMessage(`Out of tries — the word was "${secret.toUpperCase()}"`);
            return;
        }

        // move to next row
        setCurrentRow((r) => r + 1);
        setCurrentCol(0);
    };

    // small helper: prefill board (for dev)
    useEffect(() => {
        // nothing for now
    }, []);

    const value = {
        board,
        onKey,
        keyStates,
        currentRow,
        currentCol,
        message,
        resetGame,
        secret,
        won,
        lost,
    };

    return value;
}
