"use client";

import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import List from "./List";
import InlineEdit from "./InlineEdit";
import CardPreview from "./CardPreview";
import styles from "./Board.module.scss";
import { useBoard, useBoardActions } from "../presentation/hooks/useBoard";
import { sortLists } from "../presentation/selectors/boardSelectors";
import { useBoardDnd, dndListId } from "../presentation/hooks/useBoardDnd";

interface BoardProps {
  onAddList?: () => void;
}

export default function Board({ onAddList }: BoardProps) {
  const { status, board } = useBoard();
  const actions = useBoardActions();

  const { activeCard, handleDragStart, handleDragEnd } = useBoardDnd(board, {
    reorderLists: actions.reorderLists,
    reorderCards: actions.reorderCards,
    moveCardBetweenLists: actions.moveCardBetweenLists,
    moveCardWithinList: actions.moveCardWithinList,
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 150,
        tolerance: 5,
      },
    })
  );

  if (status === "booting" || !board) {
    return (
      <div className={styles.boardContainer}>
        <div className={styles.loadingState}>Loading board...</div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className={styles.boardContainer}>
        <div className={styles.loadingState}>
          Something went wrong loading the board.
        </div>
      </div>
    );
  }

  const sortedLists = sortLists(board.lists);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className={styles.boardContainer}>
        <div className={styles.boardHeader}>
          <InlineEdit
            value={board.title}
            onSave={actions.setBoardTitle}
            className={styles.boardTitle}
            as="h2"
          />
          <button
            className={styles.addListButton}
            onClick={onAddList || (() => actions.addList())}
            title="Add a new list"
          >
            + Add List
          </button>
        </div>

        <div className={styles.listsContainer}>
          <SortableContext
            items={sortedLists.map((l) => dndListId(l.id))}
            strategy={horizontalListSortingStrategy}
          >
            {sortedLists.map((list) => (
              <List key={list.id} list={list} />
            ))}
          </SortableContext>
        </div>
      </div>

      <DragOverlay>
        {activeCard ? <CardPreview card={activeCard} /> : null}
      </DragOverlay>
    </DndContext>
  );
}
