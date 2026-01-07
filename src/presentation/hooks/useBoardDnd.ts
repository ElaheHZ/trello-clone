"use client";

import { useState } from "react";
import type { DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import type { Board, Card, Id } from "../../domain/board/models";
import {
  findCard,
  findListContainingCard,
  sortLists,
  sortCards,
} from "../selectors/boardSelectors";

type DndKind = "list" | "card" | "list-drop";

const prefix = {
  list: "list:",
  card: "card:",
  listDrop: "list-drop:",
} as const;

export function dndListId(listId: Id) {
  return `${prefix.list}${listId}`;
}

export function dndCardId(cardId: Id) {
  return `${prefix.card}${cardId}`;
}

export function dndListDropId(listId: Id) {
  return `${prefix.listDrop}${listId}`;
}

function parseDndId(raw: string): { kind: DndKind; id: Id } | null {
  if (raw.startsWith(prefix.list))
    return { kind: "list", id: raw.slice(prefix.list.length) };
  if (raw.startsWith(prefix.card))
    return { kind: "card", id: raw.slice(prefix.card.length) };
  if (raw.startsWith(prefix.listDrop))
    return { kind: "list-drop", id: raw.slice(prefix.listDrop.length) };
  return null;
}

export function useBoardDnd(
  board: Board | null,
  actions: {
    reorderLists: (ids: Id[]) => void;
    reorderCards: (listId: Id, ids: Id[]) => void;
    moveCardBetweenLists: (
      cardId: Id,
      fromListId: Id,
      toListId: Id,
      toIndex: number
    ) => void;
    moveCardWithinList: (
      listId: Id,
      fromIndex: number,
      toIndex: number
    ) => void;
  }
) {
  const [activeCard, setActiveCard] = useState<Card | null>(null);

  const handleDragStart = (event: DragStartEvent) => {
    const active = parseDndId(String(event.active.id));
    if (!active) return;
    if (!board) return;

    if (active.kind === "card") {
      const card = findCard(board, active.id);
      setActiveCard(card);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const active = parseDndId(String(event.active.id));
    const over = event.over ? parseDndId(String(event.over.id)) : null;

    setActiveCard(null);

    if (!active || !over) return;
    if (!board) return;

    if (active.kind === "list" && over.kind === "list") {
      const ordered = sortLists(board.lists).map((l) => l.id);
      const fromIndex = ordered.indexOf(active.id);
      const toIndex = ordered.indexOf(over.id);
      if (fromIndex < 0 || toIndex < 0 || fromIndex === toIndex) return;
      const next = [...ordered];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      actions.reorderLists(next);
      return;
    }

    if (active.kind === "card") {
      const fromList = findListContainingCard(board, active.id);
      if (!fromList) return;

      let toListId: Id | null = null;
      let toIndex = 0;

      if (over.kind === "list" || over.kind === "list-drop") {
        toListId = over.id;
        const toList = board.lists.find((l) => l.id === toListId);
        if (!toList) return;
        toIndex = toList.cards.length;
      } else if (over.kind === "card") {
        const toList = findListContainingCard(board, over.id);
        if (!toList) return;
        toListId = toList.id;
        const sorted = sortCards(toList.cards);
        const idx = sorted.findIndex((c) => c.id === over.id);
        toIndex = idx >= 0 ? idx : sorted.length;
      }

      if (!toListId) return;

      if (fromList.id === toListId) {
        const sorted = sortCards(fromList.cards);
        const fromIndex = sorted.findIndex((c) => c.id === active.id);
        const overIndex = toIndex;
        if (fromIndex < 0 || overIndex < 0 || fromIndex === overIndex) return;
        actions.moveCardWithinList(fromList.id, fromIndex, overIndex);
        return;
      }

      actions.moveCardBetweenLists(active.id, fromList.id, toListId, toIndex);
    }
  };

  return { activeCard, handleDragStart, handleDragEnd };
}
