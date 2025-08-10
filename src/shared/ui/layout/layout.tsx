import React from 'react';
import Header from '../header';
import styles from './layout.module.scss';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className={styles.app}>
            <div className={styles.headerWrapper}>
                <Header />
            </div>

            <main className={styles.container}>
                <div className={styles.page}>{children}</div>
            </main>

            <footer className={styles.footer}>© {new Date().getFullYear()} WGames — Minimalist word games</footer>
        </div>
    );
};

export default Layout;
