"use client";

import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import type { Card as CardType } from "../types/board";
import InlineEdit from "./InlineEdit";
import styles from "./Card.module.scss";
import { useBoardActions } from "../presentation/hooks/useBoard";
import { dndCardId } from "../presentation/hooks/useBoardDnd";

interface CardProps {
  card: CardType;
}

export default function Card({ card }: CardProps) {
  const actions = useBoardActions();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: dndCardId(card.id) });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this card?")) {
      actions.deleteCard(card.id);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${styles.card} ${isDragging ? styles.dragging : ""}`}
      {...attributes}
      {...listeners}
    >
      <div className={styles.cardContent}>
        <InlineEdit
          value={card.title}
          onSave={(title) => actions.setCardTitle(card.id, title)}
          className={styles.cardTitle}
          as="h3"
        />

        {card.comments.length > 0 && (
          <div className={styles.commentBadge}>{card.comments.length}</div>
        )}
      </div>

      <div className={styles.cardActions}>
        <button
          className={styles.actionButton}
          onClick={() => actions.openCardComments(card.id)}
          title="View and add comments"
          aria-label="Open comments for this card"
        >
          💬
        </button>
        <button
          className={styles.actionButton}
          onClick={handleDelete}
          title="Delete card"
          aria-label="Delete this card"
        >
          🗑️
        </button>
      </div>
    </div>
  );
}
