// src/features/word-wave/components/keyboard/keyboard.tsx

// src/features/word-wave/components/Keyboard/Keyboard.tsx
import type { LetterState } from '../../types/letter-state';
import styles from './Keyboard.module.scss';
import cn from 'classnames';

const ROWS = ['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM'];

export default function Keyboard({
    onKey,
    keyStates,
}: {
    onKey: (k: string) => void;
    keyStates: Record<string, LetterState>;
}) {
    function renderKey(k: string) {
        const st = keyStates[k.toLowerCase()];
        return (
        <button
            key={k}
            className={cn(styles.key, {
            [styles.correct]: st === 'correct',
            [styles.present]: st === 'present',
            [styles.absent]: st === 'absent',
            })}
            onClick={() => onKey(k)}
            aria-label={k}
        >
            {k}
        </button>
        );
    }

    return (
        <div className={styles.keyboard} role="application" aria-label="Keyboard">
            <div className={styles.row}>{ROWS[0].split('').map(renderKey)}</div>
            <div className={styles.row}>{ROWS[1].split('').map(renderKey)}</div>
            <div className={styles.row}>
                <button className={cn(styles.key, styles.wide)} onClick={() => onKey('ENTER')}>
                Enter
                </button>
                {ROWS[2].split('').map(renderKey)}
                <button className={cn(styles.key, styles.wide)} onClick={() => onKey('BACK')}>
                ⌫
                </button>
            </div>
        </div>
    );
}
