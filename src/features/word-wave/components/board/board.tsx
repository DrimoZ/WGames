// src/features/word-wave/components/Board/Board.tsx
import type { Tile as TileType } from '../../types/tile';
import Tile from '../tile/tile';
import styles from './board.module.scss';

export default function Board({
    board,
    mode,
    currentRow,
}: {
    board: TileType[][];
    mode: string;
    currentRow: number;
}) {
    const showOnlyLast = mode === 'extreme';

    return (
        <div className={styles.board} role="grid" aria-label="Word Wave board">
        {board.map((row, rIdx) => {
            const reveal = !showOnlyLast ? true : currentRow - 1 === rIdx;
            return (
            <div key={rIdx} className={styles.row} role="row" aria-rowindex={rIdx + 1}>
                {row.map((t, cIdx) => (
                <Tile key={cIdx} char={t.char} state={t.state} reveal={reveal} />
                ))}
            </div>
            );
        })}
        </div>
    );
}
