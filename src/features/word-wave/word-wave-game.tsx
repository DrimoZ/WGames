// src/features/word-wave/word-wave-game.tsx

import { useEffect, useState } from 'react';
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

    // Add loading state management
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (gameState) {
        setIsLoading(false);
        }
    }, [gameState]);

    // Add keyboard event handlers
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (!gameState || isLoading) return;

            switch(event.key.toLowerCase()) {
                case 'backspace':
                    event.preventDefault();
                    onKeyInput('BACK');
                    break;
                case 'enter':
                    event.preventDefault();
                    onKeyInput('ENTER');
                    break;
                default:
                    if (/^[a-z]$/.test(event.key)) {
                        event.preventDefault();
                        onKeyInput(event.key.toUpperCase());
                    }
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [gameState, isLoading, onKeyInput]);

    if (isLoading) {
        return <div className={styles.root}>Loading...</div>;
    }

    if (!gameState) {
        return <div className={styles.root}>Error: No game state found</div>;
    }

    return (
        <div className={styles.root}>
            <header className={styles.header}>
                <div className={styles.headerBlock}>
                    <h1 className={styles.title}>Word Wave</h1>
                    <ModeSelector mode={mode} onChange={changeMode} />
                </div>
            </header>

            <main className={styles.main}>
                <div className={styles["board-container"]}>
                    <Board board={board} mode={mode} currentRow={gameState.currentRow} />
                </div>

                <div className={styles.statusBar}>
                    { (gameState.gameStatus === 'not-started' || gameState.gameStatus === 'in-progress') && <span className={styles.msg}>{gameState.message}</span> }
                    { gameState.gameStatus === 'completed' && <span className={styles.win}>You won!</span> }
                    { gameState.gameStatus === 'failed' && <span className={styles.fail}>Out of tries</span> }
                </div>

                <Keyboard onKey={onKeyInput} keyStates={keyStates} />
            </main>
        </div>
    );
}
