// scr/shared/ui/game-card/game-card.tsx

import React from 'react';
import { Link } from 'react-router-dom';
import cn from 'classnames';
import styles from './game-card.module.scss';

type Props = {
    title: string;
    description?: string;
    to?: string;
    comingSoon?: boolean;
    icon?: React.ReactNode;
};

const GameCard: React.FC<Props> = ({ title, description, to = '#', comingSoon = false, icon }) => {
    const isLink = !!to && to !== '#';
    const rootClass = cn(styles.card, comingSoon && styles.comingSoon);

    const content = (
        <>
        <div className={styles.meta}>
            <div className={styles.head}>
            <div className={styles.iconWrap}>{icon ?? <span className={styles.fallbackIcon}>🎮</span>}</div>
            <div>
                <h3 className={styles.cardTitle}>{title}</h3>
                {comingSoon && <span className={styles.badge}>Coming soon</span>}
            </div>
            </div>
            {description && <p className={styles.desc}>{description}</p>}
        </div>

        <div className={styles.actions}>
            {isLink ? (
            <Link to={to} className={styles.play} aria-label={`Play ${title}`}>
                Play
            </Link>
            ) : (
            <button className={styles.play} aria-disabled={comingSoon} disabled={comingSoon}>
                {comingSoon ? 'Coming' : 'Open'}
            </button>
            )}
        </div>
        </>
    );

    // Wrap in article for semantics. If it's a link, inner Link handles routing.
    return (
        <article className={rootClass} role="group" aria-labelledby={`gc-${title.replace(/\s+/g, '-')}`}>
        {content}
        </article>
    );
};

export default GameCard;
