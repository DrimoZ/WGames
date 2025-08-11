// src/features/word-wave/word-wave-game.tsx

import Board from './components/board/board';
import Keyboard from './components/keyboard/keyboard';
import ModeSelector from './components/mode-selector/mode-selector';
import { useWordWave } from './hooks/use-word-wave';
import styles from './word-wave-game.module.scss';

export default function WordWaveGame() {
    const {
        gameState,
        board,
        mode,
        keyStates,
        changeMode,
        onKeyInput,
    } = useWordWave();

    if (!gameState) {
        return <div className={styles.root}>Loading...</div>;
    }

    return (
        <div className={styles.root}>
            <header className={styles.header}>
                <div>
                    <h1 className={styles.title}>Word Wave</h1>
                    <p className={styles.subtitle}>
                        Mode: <strong>{mode}</strong>
                    </p>
                </div>

                <div className={styles.controls}>
                    <ModeSelector mode={mode} onChange={changeMode} />
                </div>
            </header>

            <main className={styles.main}>
                <Board board={board} mode={mode} currentRow={gameState.currentRow} />

                <div className={styles.rowInfo}>
                    <div className={styles.msg} role="status" aria-live="polite">{gameState.message || ''}</div>
                    {/* (won ? 'You won!' : lost ? `Lost — ${secret.toUpperCase()}` : '') */}
                </div>

                <Keyboard onKey={onKeyInput} keyStates={keyStates} />
            </main>
        </div>
    );
}
