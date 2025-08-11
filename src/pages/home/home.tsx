import React from 'react';
import { Link } from 'react-router-dom';
import styles from './home.module.scss';
import GameCard from '../../shared/ui/game-card/game-card';

const Home: React.FC = () => {
    return (
        <div className={styles.home} role="main">
            <section className={styles.hero} aria-labelledby="home-title">
                <div className={styles.heroInner}>
                    <h1 id="home-title" className={styles.title}>WGames</h1>
                    <p className={styles.lead}>
                        Minimalist, futuristic word games — short sessions, big vibes. Play anywhere, on any device.
                    </p>

                        <div className={styles.ctaRow}>
                            <Link to="/games/wordwave" className={styles.cta}>
                                Play Word Wave
                            </Link>
                            <a
                                className={styles.secondary}
                                href="#features"
                                onClick={(e) => {
                                    e.preventDefault();
                                    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                                }}
                            >
                                Explore features
                            </a>
                        </div>
                    </div>

                    <div className={styles.heroVisual} aria-hidden>
                    <div className={styles.pulse} />
                </div>
            </section>

            <section id="features" className={styles.features} aria-labelledby="features-title">
                <h2 id="features-title" className={styles.sectionTitle}>Games & Features</h2>
                <div className={styles.grid}>
                <GameCard
                    title="Word Wave"
                    description="Daily five-letter puzzles. Quick, satisfying rounds with subtle animations."
                    to="/games/wordwave"
                />
                <GameCard
                    title="Mini-Arcade (coming soon)"
                    description="Short neon micro-games (planning). Modular & pluggable."
                    to="#"
                    comingSoon
                />
                <GameCard
                    title="Practice Mode"
                    description="Unlimited puzzles for practice, with statistics and streak tracking."
                    to="#"
                    comingSoon
                />
                </div>
            </section>
        </div>
    );
};

export default Home;
