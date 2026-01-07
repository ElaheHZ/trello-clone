import type { Board, Card, Id, List } from "../../domain/board/models";

export function sortLists(lists: readonly List[]): List[] {
  return [...lists].sort((a, b) => a.order - b.order);
}

export function sortCards(cards: readonly Card[]): Card[] {
  return [...cards].sort((a, b) => a.order - b.order);
}

export function findList(board: Board, listId: Id): List | null {
  return board.lists.find((l) => l.id === listId) ?? null;
}

export function findCard(board: Board, cardId: Id): Card | null {
  for (const list of board.lists) {
    const card = list.cards.find((c) => c.id === cardId);
    if (card) return card;
  }
  return null;
}

export function findListContainingCard(board: Board, cardId: Id): List | null {
  for (const list of board.lists) {
    if (list.cards.some((c) => c.id === cardId)) return list;
  }
  return null;
}
