// src/features/word-wave/components/tile/tile.tsx

import React from 'react';
import styles from './tile.module.scss';
import cn from 'classnames';

type Props = {
    letter?: string;
    state?: 'empty' | 'filled' | 'correct' | 'present' | 'absent';
    reveal?: boolean;
    index?: number; // column index used for stagger timing
};

const Tile: React.FC<Props> = ({ letter = '', state = 'empty', reveal = false, index = 0 }) => {
    // compute a staggered delay (ms)
    const delay = `${index * 180}ms`;
    const classes = cn(styles.tile, {
        [styles.filled]: state === 'filled',
        [styles.correct]: state === 'correct',
        [styles.present]: state === 'present',
        [styles.absent]: state === 'absent',
        [styles.reveal]: reveal,
    });

    return (
        <div
            className={classes}
            role="gridcell"
            aria-label={letter ? `${letter.toUpperCase()} ${state}` : 'empty'}
            style={reveal ? { transitionDelay: delay } : {}}
        >
            <div className={styles.inner}>
                <span className={styles.letter}>{letter ? letter.toUpperCase() : ''}</span>
            </div>
        </div>
    );
};

export default Tile;
