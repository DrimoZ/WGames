// src/features/word-wave/types/letter-result.ts

import type { LetterState } from "./letter-state";

export type LetterResult = {
    char: string;
    state: Exclude<LetterState, 'empty' | 'filled'>;
}