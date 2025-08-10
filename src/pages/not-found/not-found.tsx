import React from 'react';
import { Link } from 'react-router-dom';
import styles from './not-found.module.scss';

const NotFound: React.FC = () => {
    return (
        <div className={styles.root} role="main" aria-labelledby="notfound-title">
        <div className={styles.card}>
            <div className={styles.code}>404</div>
            <h1 id="notfound-title" className={styles.title}>WGames — Page not found</h1>
            <p className={styles.lead}>
            The page you're looking for doesn't exist — maybe it moved, or maybe the nebula ate it.
            </p>
            <div className={styles.actions}>
            <Link to="/" className={styles.homeBtn}>Return home</Link>
            </div>
        </div>
        </div>
    );
};

export default NotFound;
