import type { Board, Card, Id, List } from "./models";
import { createCard, createComment, createList } from "./factory";
import { nowMs } from "../../shared/time";
import { moveItem } from "../../shared/array";

function touch(board: Board): Board {
  return { ...board, updatedAtMs: nowMs() };
}

function normalizeListOrders(lists: readonly List[]): List[] {
  return lists.map((l, idx) => ({ ...l, order: idx }));
}

function normalizeCardOrders(cards: readonly Card[]): Card[] {
  return cards.map((c, idx) => ({ ...c, order: idx }));
}

export function setBoardTitle(board: Board, title: string): Board {
  return touch({ ...board, title });
}

export function addList(board: Board, title = "New List"): Board {
  const list = createList(board.id, title, board.lists.length);
  return touch({ ...board, lists: [...board.lists, list] });
}

export function renameList(board: Board, listId: Id, title: string): Board {
  const lists = board.lists.map((l) => (l.id === listId ? { ...l, title } : l));
  return touch({ ...board, lists });
}

export function deleteList(board: Board, listId: Id): Board {
  const lists = normalizeListOrders(board.lists.filter((l) => l.id !== listId));
  return touch({ ...board, lists });
}

export function reorderLists(
  board: Board,
  orderedListIds: readonly Id[]
): Board {
  const map = new Map(board.lists.map((l) => [l.id, l] as const));
  const lists = orderedListIds
    .map((id) => map.get(id))
    .filter((x): x is List => Boolean(x));

  if (lists.length !== board.lists.length) return board;

  return touch({ ...board, lists: normalizeListOrders(lists) });
}

export function addCard(board: Board, listId: Id, title = "New Card"): Board {
  const lists = board.lists.map((l) => {
    if (l.id !== listId) return l;
    const card = createCard(listId, title, l.cards.length);
    return { ...l, cards: [...l.cards, card] };
  });
  return touch({ ...board, lists });
}

export function renameCard(board: Board, cardId: Id, title: string): Board {
  const lists = board.lists.map((l) => ({
    ...l,
    cards: l.cards.map((c) => (c.id === cardId ? { ...c, title } : c)),
  }));
  return touch({ ...board, lists });
}

export function deleteCard(board: Board, cardId: Id): Board {
  const lists = board.lists.map((l) => {
    const nextCards = l.cards.filter((c) => c.id !== cardId);
    return nextCards.length === l.cards.length
      ? l
      : { ...l, cards: normalizeCardOrders(nextCards) };
  });
  return touch({ ...board, lists });
}

export function reorderCards(
  board: Board,
  listId: Id,
  orderedCardIds: readonly Id[]
): Board {
  const lists = board.lists.map((l) => {
    if (l.id !== listId) return l;
    const map = new Map(l.cards.map((c) => [c.id, c] as const));
    const cards = orderedCardIds
      .map((id) => map.get(id))
      .filter((x): x is Card => Boolean(x));
    if (cards.length !== l.cards.length) return l;
    return { ...l, cards: normalizeCardOrders(cards) };
  });
  return touch({ ...board, lists });
}

export function moveCardBetweenLists(
  board: Board,
  cardId: Id,
  fromListId: Id,
  toListId: Id,
  toIndex: number
): Board {
  if (fromListId === toListId) return board;

  let cardToMove: Card | null = null;

  let lists = board.lists.map((l) => {
    if (l.id !== fromListId) return l;
    const found = l.cards.find((c) => c.id === cardId) ?? null;
    if (found) cardToMove = found;
    const remaining = l.cards.filter((c) => c.id !== cardId);
    return { ...l, cards: normalizeCardOrders(remaining) };
  });

  if (!cardToMove) return board;

  lists = lists.map((l) => {
    if (l.id !== toListId) return l;
    const next = [...l.cards];
    const safeIndex = Math.max(0, Math.min(toIndex, next.length));
    next.splice(safeIndex, 0, { ...cardToMove!, listId: toListId });
    return { ...l, cards: normalizeCardOrders(next) };
  });

  return touch({ ...board, lists });
}

export function moveCardWithinList(
  board: Board,
  listId: Id,
  fromIndex: number,
  toIndex: number
): Board {
  const lists = board.lists.map((l) => {
    if (l.id !== listId) return l;
    const moved = moveItem(l.cards, fromIndex, toIndex);
    return { ...l, cards: normalizeCardOrders(moved) };
  });
  return touch({ ...board, lists });
}

export function addCommentToCard(
  board: Board,
  cardId: Id,
  text: string,
  author: string
): Board {
  const comment = createComment(text, author);
  const lists = board.lists.map((l) => ({
    ...l,
    cards: l.cards.map((c) =>
      c.id === cardId ? { ...c, comments: [...c.comments, comment] } : c
    ),
  }));
  return touch({ ...board, lists });
}

export function deleteCommentFromCard(
  board: Board,
  cardId: Id,
  commentId: Id
): Board {
  const lists = board.lists.map((l) => ({
    ...l,
    cards: l.cards.map((c) =>
      c.id === cardId
        ? { ...c, comments: c.comments.filter((cm) => cm.id !== commentId) }
        : c
    ),
  }));
  return touch({ ...board, lists });
}
