import React from 'react';
import { Link } from 'react-router-dom';
import styles from './header.module.scss';

const Header: React.FC = () => {
    return (
        <header className={styles.header}>
            <Link to="/" className={styles.brand}>
                <div className={styles.logo} aria-hidden>
                    {/* simple monogram — keeps it lightweight */}
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="1.5" y="1.5" width="21" height="21" rx="5" stroke="currentColor" strokeWidth="1.4" />
                        <text x="50%" y="53%" textAnchor="middle" dominantBaseline="middle" fontSize="11" fontWeight="800" fill="currentColor">WG</text>
                    </svg>
                </div>
                <span className={styles.title}>WGames</span>
            </Link>

            <nav className={styles.nav}>
                <Link to="/games/wordwave">Word Wave</Link>
                <Link to="/about">About</Link>
            </nav>
        </header>
    );
};

export default Header;
