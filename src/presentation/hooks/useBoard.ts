"use client";

import { useMemo } from "react";
import type { Id } from "../../domain/board/models";
import { useBoardDispatch, useBoardState } from "../../state/board/store";

export function useBoard() {
  return useBoardState();
}

export function useBoardActions() {
  const dispatch = useBoardDispatch();

  return useMemo(
    () => ({
      setBoardTitle: (title: string) => dispatch({ type: "BOARD_TITLE_SET", title }),

      addList: (title?: string) => dispatch({ type: "LIST_ADD", title }),
      setListTitle: (listId: Id, title: string) =>
        dispatch({ type: "LIST_TITLE_SET", listId, title }),
      deleteList: (listId: Id) => dispatch({ type: "LIST_DELETE", listId }),
      reorderLists: (orderedListIds: Id[]) =>
        dispatch({ type: "LISTS_REORDER", orderedListIds }),

      addCard: (listId: Id, title?: string) =>
        dispatch({ type: "CARD_ADD", listId, title }),
      setCardTitle: (cardId: Id, title: string) =>
        dispatch({ type: "CARD_TITLE_SET", cardId, title }),
      deleteCard: (cardId: Id) => dispatch({ type: "CARD_DELETE", cardId }),
      reorderCards: (listId: Id, orderedCardIds: Id[]) =>
        dispatch({ type: "CARDS_REORDER", listId, orderedCardIds }),
      moveCardBetweenLists: (
        cardId: Id,
        fromListId: Id,
        toListId: Id,
        toIndex: number
      ) =>
        dispatch({
          type: "CARD_MOVE_BETWEEN",
          cardId,
          fromListId,
          toListId,
          toIndex,
        }),
      moveCardWithinList: (listId: Id, fromIndex: number, toIndex: number) =>
        dispatch({ type: "CARD_MOVE_WITHIN", listId, fromIndex, toIndex }),

      addComment: (cardId: Id, text: string, author: string) =>
        dispatch({ type: "COMMENT_ADD", cardId, text, author }),
      deleteComment: (cardId: Id, commentId: Id) =>
        dispatch({ type: "COMMENT_DELETE", cardId, commentId }),

      openCardComments: (cardId: Id) => dispatch({ type: "CARD_SELECT", cardId }),
      closeCardComments: () => dispatch({ type: "CARD_DESELECT" }),
    }),
    [dispatch]
  );
}
