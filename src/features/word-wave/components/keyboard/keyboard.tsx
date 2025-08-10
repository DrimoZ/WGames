// src/features/word-wave/components/keyboard/keyboard.tsx

import React from 'react';
import styles from './keyboard.module.scss';
import cn from 'classnames';

type KeyState = 'empty' | 'filled' | 'correct' | 'present' | 'absent';
type Props = {
    onKey: (k: string) => void;
    keyStates: Record<string, KeyState>;
};

const rows = ['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM'];

const Keyboard: React.FC<Props> = ({ onKey, keyStates }) => {
    const renderKey = (k: string) => {
        const st = keyStates[k.toLowerCase()] ?? 'empty';
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
    };

    return (
        <div className={styles.keyboard} role="application" aria-label="On-screen keyboard">
            <div className={styles.row}>
                {rows[0].split('').map(renderKey)}
            </div>

            <div className={styles.row}>
                {rows[1].split('').map(renderKey)}
            </div>

            <div className={styles.row}>
                <button className={styles.wide} onClick={() => onKey('ENTER')}>Enter</button>
                {rows[2].split('').map(renderKey)}
                <button className={styles.wide} onClick={() => onKey('BACK')}>⌫</button>
            </div>
        </div>
    );
};

export default Keyboard;
