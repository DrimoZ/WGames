// src/features/word-wave/word-wave-game.tsx

import React from 'react';
import { Link } from 'react-router-dom';
import styles from './word-wave-game.module.scss';
import useWordWave from './hooks/use-word-wave';
import Board from './components/board/board';
import Keyboard from './components/keyboard/keyboard';

const WordWaveGame: React.FC = () => {
    const {
        board,
        keyStates,
        currentRow,
        currentCol,
        message,
        onKey,
        secret,
        resetGame,
        won,
        lost,
    } = useWordWave();

    return (
        <div className={styles.root}>
        <header className={styles.header}>
            <div>
            <h1 className={styles.title}>Word Wave</h1>
            <p className={styles.subtitle}>Guess the <strong>5-letter</strong> word in 6 tries.</p>
            </div>

            <nav className={styles.headerNav}>
            <Link to="/" className={styles.smallLink}>Home</Link>
            <button className={styles.ghost} onClick={resetGame}>New</button>
            </nav>
        </header>

        <main className={styles.main}>
            <Board board={board} currentRow={currentRow} revealRow={currentRow} />
            <div className={styles.infoRow}>
            <div className={styles.msg} role="status" aria-live="polite">{message}</div>
            <div className={styles.secretHint}> {/* small dev hint, remove in prod */}
                {won ? <span className={styles.success}>You won — {secret.toUpperCase()}</span> : null}
                {lost ? <span className={styles.warn}>Solution: {secret.toUpperCase()}</span> : null}
            </div>
            </div>
            <Keyboard onKey={onKey} keyStates={keyStates} />
        </main>
        </div>
    );
};

export default WordWaveGame;
