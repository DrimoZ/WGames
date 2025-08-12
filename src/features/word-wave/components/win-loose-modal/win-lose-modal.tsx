import { useEffect, useMemo, useRef, useState } from 'react';
import type { GameState } from '../../types/game-state';
import { MODE_CONFIG } from '../../constants/mode-configs';
import styles from './win-lose-modal.module.scss';

/* ------------------------------
    Helpers / small utilities
------------------------------ */

const CONFETTI_DURATION_MS = 4200;
const CONFETTI_COUNT = 110;
const CONFETTI_COLORS = ['#00E5FF', '#FF3DA6', '#A3FF4D', '#FFB86B', '#A88CFF'];

/** Format milliseconds to H:MM:SS or MM:SS */
function formatDuration(ms: number): string {
    if (ms <= 0) return '00:00';
    const total = Math.floor(ms / 1000);
    const h = Math.floor(total / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = total % 60;
    if (h > 0) return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

/** Milliseconds until next UTC midnight */
function msUntilNextUTCMidnight(): number {
    const now = new Date();
    const next = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1));
    return Math.max(0, next.getTime() - now.getTime());
}

/* ------------------------------
    Small confetti controller
    encapsulates canvas animation & cleanup
------------------------------ */
function createConfettiController(canvas: HTMLCanvasElement) {
    if (!canvas) return null;

    const ctx = canvas.getContext('2d')!;
    if (!ctx) return null;

    let rafId = 0;
    let startTs = 0;
    const W = () => (canvas.width = window.innerWidth);
    const H = () => (canvas.height = window.innerHeight);

    // particle factory
    type Particle = { x: number; y: number; vx: number; vy: number; size: number; color: string; rot: number };

    const particles: Particle[] = [];

    function initParticles() {
        W(); H();

        particles.length = 0;
        for (let i = 0; i < CONFETTI_COUNT; i++) {
            particles.push({
                x: canvas.width / 2 + (Math.random() - 0.5) * 360,
                y: canvas.height * 0.2 + (Math.random() - 0.5) * 80,
                vx: (Math.random() - 0.5) * 7,
                vy: Math.random() * 6 + 2,
                size: Math.random() * 9 + 3,
                color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
                rot: Math.random() * Math.PI * 2,
            });
        }
    }

    function frame(t: number) {
        if (!startTs) startTs = t;
        const elapsed = t - startTs;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            p.vy += 0.12;
            p.x += p.vx;
            p.y += p.vy;
            p.rot += 0.06;

            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rot);
            ctx.fillStyle = p.color;
            ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
            ctx.restore();
        }

        if (elapsed < CONFETTI_DURATION_MS) {
            rafId = requestAnimationFrame(frame);
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            cancelAnimationFrame(rafId);
        }
    }

    function start() {
        initParticles();
        startTs = 0;
        rafId = requestAnimationFrame(frame);
        window.addEventListener('resize', resize);
    }

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function cleanup() {
        window.removeEventListener('resize', resize);
        cancelAnimationFrame(rafId);
        if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    return { start, cleanup };
}

/* ------------------------------
    Component
------------------------------ */

type Props = {
    visible: boolean;
    gameState: GameState | null;
};

export default function WinLoseModal({ visible, gameState }: Props) {
    const status = gameState?.gameStatus ?? null;
    const [countdownMs, setCountdownMs] = useState<number>(() => msUntilNextUTCMidnight());
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const confettiRef = useRef<ReturnType<typeof createConfettiController> | null>(null);
    const [animate, setAnimate] = useState(false);

    // only show when visible and status is complete/failed and gameState exists
    const shouldRender = visible && !!status && !!gameState;
    useEffect(() => {
        if (!shouldRender) return;

        setAnimate(true);
        setCountdownMs(msUntilNextUTCMidnight());

        const id = window.setInterval(() => setCountdownMs(msUntilNextUTCMidnight()), 1000);
        return () => {
            clearInterval(id);
            setAnimate(false);
        };
    }, [shouldRender]);

    // confetti side effect (starts only on wins)
    useEffect(() => {
        if (!shouldRender) return;
        if (status !== 'completed') return;

        confettiRef.current = createConfettiController(canvasRef.current!);
        confettiRef.current?.start();

        // cleanup
        return () => {
            confettiRef.current?.cleanup();
            confettiRef.current = null;
        };
    }, [shouldRender, status]);

    // computed stats (memo for clarity)
    const triedRows = useMemo(() => {
        if (!gameState) return 0;
        return Math.min(gameState.currentRow + 1, MODE_CONFIG[gameState.gameMode].rows);
    }, [gameState]);

    const attemptsUsed = triedRows;

    const timeTaken = useMemo(() => {
        if (!gameState) return '-';

        const started = gameState.gameStartTime;
        if (!started) return '-';

        const dt = (gameState.lastUpdate ?? Date.now()) - started;
        return formatDuration(dt);
    }, [gameState]);

    if (!shouldRender || !gameState) return null;

    const title = status === 'completed' ? 'You win ✨' : 'You lost 💥';
    const subtitle =
        status === 'completed'
        ? "Nice work — come back tomorrow for a new challenge."
        : `Better luck next time — come back tomorrow for a new challenge.`;

    return (
        <div className={styles.overlay} aria-hidden={!shouldRender} data-animate={animate ? '1' : '0'}>
            <canvas ref={canvasRef} className={styles.canvas} />

            <div className={styles.box} role="dialog" aria-modal="true" aria-labelledby="wl-title">
                <h2 id="wl-title" className={styles.title}>
                    {title}
                </h2>
                <p className={styles.sub}>{subtitle}</p>

                <div className={styles.stats}>
                    <div className={styles.stat}>
                        <div className={styles.statLabel}>Today's word</div>
                        <div className={styles.statValue}>{gameState.wordToGuess?.toUpperCase() ?? '—'}</div>
                    </div>

                    <div className={styles.stat}>
                        <div className={styles.statLabel}>Attempts</div>
                        <div className={styles.statValue}>
                            {attemptsUsed}/{MODE_CONFIG[gameState.gameMode].rows}
                        </div>
                    </div>

                    <div className={styles.stat}>
                        <div className={styles.statLabel}>Time taken</div>
                        <div className={styles.statValue}>{timeTaken}</div>
                    </div>
                </div>

                <div className={styles.bottom}>
                    <div className={styles.next}>
                        Next word (UTC) in <strong>{formatDuration(countdownMs)}</strong>
                    </div>

                    <div className={styles.placeholder}>
                        <div className={styles.placeholderTitle}>Stats (coming soon)</div>

                        <div className={styles.placeholderGrid}>
                            <div className={styles.pItem}>Streak: —</div>
                            <div className={styles.pItem}>Win %: —</div>
                            <div className={styles.pItem}>Best time: —</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
