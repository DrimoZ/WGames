// src/pages/about/about.tsx

import React from 'react';
import styles from './About.module.scss';

const About: React.FC = () => {
    return (
        <div className={styles.root} role="main">
            <div className={styles.card}>
                <h1 className={styles.title}>About WGames</h1>
                <p className={styles.lead}>
                    WGames is a small collection of minimalist, futuristic micro-games focused on short, delightful sessions.
                    We build lightweight experiences that work great on mobile and desktop with a focus on UI, accessibility and
                    performance.
                </p>

                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Our mission</h2>
                    <p>Craft tiny moments of joy — quick games that are beautiful, fair, and easy to pick up.</p>
                </section>

                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Contact</h2>
                    <p>If you want to reach us, email <a className={styles.link} href="mailto:hello@wgames.dev">hello@wgames.dev</a>.</p>
                </section>
            </div>
        </div>
    );
};

export default About;
