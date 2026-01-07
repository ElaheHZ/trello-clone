"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import type { List as ListType } from "../types/board";
import Card from "./Card";
import InlineEdit from "./InlineEdit";
import styles from "./List.module.scss";
import { useBoardActions } from "../presentation/hooks/useBoard";
import { sortCards } from "../presentation/selectors/boardSelectors";
import { dndCardId, dndListId, dndListDropId } from "../presentation/hooks/useBoardDnd";

interface ListProps {
  list: ListType;
}

export default function List({ list }: ListProps) {
  const actions = useBoardActions();

  const sortedCards = sortCards(list.cards);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: dndListId(list.id) });

  const { setNodeRef: setDropRef } = useDroppable({ id: dndListDropId(list.id) });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.8 : 1,
  };

  const handleDeleteList = () => {
    if (confirm("Are you sure you want to delete this list?")) {
      actions.deleteList(list.id);
    }
  };

  return (
    <div className={styles.list} ref={setNodeRef} style={style}>
      <div className={styles.listHeader} {...attributes} {...listeners}>
        <InlineEdit
          value={list.title}
          onSave={(title) => actions.setListTitle(list.id, title)}
          className={styles.listTitle}
          as="h2"
        />
        <span className={styles.cardCount}>{sortedCards.length}</span>
        <button
          className={styles.deleteButton}
          onClick={handleDeleteList}
          title="Delete list"
          aria-label="Delete this list"
        >
          ×
        </button>
      </div>

      <SortableContext
        items={sortedCards.map((c) => dndCardId(c.id))}
        strategy={verticalListSortingStrategy}
      >
        <div className={styles.cardsContainer} ref={setDropRef}>
          {sortedCards.map((card) => (
            <Card key={card.id} card={card} />
          ))}
        </div>
      </SortableContext>

      <button
        className={styles.addCardButton}
        onClick={() => actions.addCard(list.id)}
        title="Add a new card"
      >
        + Add Card
      </button>
    </div>
  );
}
