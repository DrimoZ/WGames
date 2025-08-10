// src/features/word-wave/components/board/board.tsx

import React from 'react';
import Tile from '../tile/tile';
import styles from './board.module.scss';

type TileType = { letter: string; state: 'empty' | 'filled' | 'correct' | 'present' | 'absent' };

const Board: React.FC<{ board: TileType[][]; currentRow: number; revealRow?: number }> = ({
    board,
    currentRow,
    revealRow = 999,
}) => {
    return (
        <div className={styles.board} role="grid" aria-label="Word Wave board">
        {board.map((row, rIdx) => {
            const reveal = rIdx < revealRow; // reveal rows already submitted
            return (
            <div key={rIdx} className={styles.row} role="row" aria-rowindex={rIdx + 1}>
                {row.map((tile, cIdx) => (
                <Tile
                    key={cIdx}
                    letter={tile.letter}
                    state={tile.state}
                    reveal={reveal}
                    index={cIdx}
                />
                ))}
            </div>
            );
        })}
        </div>
    );
};

export default Board;
