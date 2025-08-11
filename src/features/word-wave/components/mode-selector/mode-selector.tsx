// src/features/word-wave/components/mode-selector/mode-selector.tsx

import type { GameMode } from '../../types/game-mode';
import styles from './mode-selector.module.scss';
import cn from 'classnames';

const MODES: { key: GameMode; label: string; subtitle?: string }[] = [
    { key: 'classic', label: 'Classic', subtitle: '5 letters · 6 guesses · show all' },
    { key: 'hard', label: 'Hard', subtitle: '7 letters · 6 guesses · show all' },
    { key: 'extreme', label: 'Extreme', subtitle: '9-10 letters · 6 guesses · only last' },
    { key: 'endless', label: 'Endless', subtitle: 'Random length · 6 guesses' },
];

export default function ModeSelector({ mode, onChange }: { mode: GameMode; onChange: (m: GameMode) => void }) {
    return (
        <div className={styles.root} role="tablist" aria-label="Game modes">
        {MODES.map((m) => (
            <button
            key={m.key}
            className={cn(styles.modeBtn, mode === m.key && styles.active)}
            onClick={() => onChange(m.key)}
            role="tab"
            aria-selected={mode === m.key}
            >
            <div className={styles.label}>{m.label}</div>
            <div className={styles.sub}>{m.subtitle}</div>
            </button>
        ))}
        </div>
    );
}
