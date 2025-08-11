// src/features/word-wave/components/tile/tile.tsx

import type { LetterState } from '../../types/letter-state';
import styles from './tile.module.scss';
import cn from 'classnames';

export default function Tile({ char, state, reveal = true }: { char: string; state: LetterState; reveal?: boolean }) {
    const className = cn(styles.tile, {
        [styles.absent]: state === 'absent' && reveal,
        [styles.present]: state === 'present' && reveal,
        [styles.correct]: state === 'correct' && reveal,
        [styles.filled]: state === 'filled' || (!reveal && char),
    });

    return (
        <div className={className} role="gridcell" aria-label={char ? `${char} ${state}` : 'empty'}>
        <span className={styles.letter}>{char ? char.toUpperCase() : ''}</span>
        </div>
    );
}
