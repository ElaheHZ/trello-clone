"use client";

import type { Card as CardType } from "../types/board";
import styles from "./Card.module.scss";

export default function CardPreview({ card }: { card: CardType }) {
  return (
    <div className={styles.card} style={{ opacity: 0.85 }}>
      <div className={styles.cardContent}>
        <h3 className={styles.cardTitle}>{card.title}</h3>
        {card.comments.length > 0 && (
          <div className={styles.commentBadge}>{card.comments.length}</div>
        )}
      </div>
    </div>
  );
}
