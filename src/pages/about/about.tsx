// src/pages/about/about.tsx

import React from 'react';
import { Link } from 'react-router-dom';
import styles from './About.module.scss';

const About: React.FC = () => {
    return (
        <div className={styles.root} role="main" aria-labelledby="about-title">
            <div className={styles.card}>
                <header className={styles.header}>
                    <div>
                        <h1 id="about-title" className={styles.title}>About WGames</h1>
                        <p className={styles.tagline}>
                            Minimalist micro-games — fast rounds, pleasant UI and accessibility first.
                        </p>
                    </div>

                    <div className={styles.cta}>
                        <Link to="/games/wordwave" className={styles.playBtn} aria-label="Play Word Wave">
                            ▶ Play Word Wave
                        </Link>
                        <a className={styles.repo} href="https://github.com/DrimoZ/WGames" target="_blank" rel="noreferrer">
                            View source
                        </a>
                    </div>
                </header>

                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Our mission</h2>
                    <p className={styles.paragraph}>
                        WGames crafts tiny moments of delight. We focus on short, replayable games with clean UX, good
                        accessibility, and very small footprint so they feel instant on mobile and desktop alike.
                    </p>
                </section>

                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Featured game — <span className={styles.gameName}>Word Wave</span></h2>
                    <p className={styles.paragraph}>
                        <strong>Word Wave</strong> is our take on the daily word puzzle: daily-synced words (same for all users),
                        multiple modes (Classic / Hard / Extreme), and clear feedback. The game resets automatically at UTC midnight;
                        there is no manual reset. Mode progress is preserved per day.
                    </p>
                    <ul className={styles.points}>
                        <li><strong>Classic:</strong> 5-letter words, 6 guesses.</li>
                        <li><strong>Hard:</strong> 7-letter words, 6 guesses.</li>
                        <li><strong>Extreme:</strong> 9-letter words, 6 guesses, limited reveal.</li>
                    </ul>
                </section>

                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Tech & values</h2>
                    <dl className={styles.techList}>
                        <div>
                            <dt>Frontend</dt>
                            <dd>Vite + React + TypeScript</dd>
                        </div>
                        <div>
                            <dt>Styling</dt>
                            <dd>SCSS, CSS variables, modular component styles</dd>
                        </div>
                        <div>
                            <dt>Design goals</dt>
                            <dd>Accessibility, responsiveness, small bundle size</dd>
                        </div>
                        <div>
                            <dt>Data</dt>
                            <dd>Daily words deterministic and identical for all users (no server required)</dd>
                        </div>
                    </dl>
                </section>

                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Contribute & License</h2>
                    <p className={styles.paragraph}>
                        WGames is open-source. Contributions, issues and PRs are welcome on GitHub. The project aims to stay
                        small and maintainable so new games can be added easily via modular components.
                    </p>
                </section>

                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Privacy & fair play</h2>
                    <p className={styles.paragraph}>
                        We don’t collect personal data. Local storage is used only to store daily game progress and optional
                        local statistics. If you want a feature removed or have privacy concerns, contact us.
                    </p>
                </section>

                <footer className={styles.footer}>
                    <div>Contact: <a className={styles.link} href="mailto:hello@wgames.dev">hello@wgames.dev</a></div>
                    <div className={styles.small}>© {new Date().getFullYear()} WGames — built with ❤️ for small good experiences.</div>
                </footer>
            </div>
        </div>
    );
};

export default About;