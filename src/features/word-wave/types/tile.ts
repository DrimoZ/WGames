// src/features/word-wave/types/tile.ts

import type { LetterState } from './letter-state';

export type Tile = {
    char: string;
    state: LetterState;
};
