import type { BoardState } from "./types";
import type { BoardAction } from "./actions";
import {
  addCard,
  addCommentToCard,
  addList,
  deleteCard,
  deleteCommentFromCard,
  deleteList,
  moveCardBetweenLists,
  moveCardWithinList,
  reorderCards,
  reorderLists,
  renameCard,
  renameList,
  setBoardTitle,
} from "../../domain/board/operations";

export const initialBoardState: BoardState = {
  status: "booting",
  board: null,
  selectedCardId: null,
};

export function boardReducer(
  state: BoardState,
  action: BoardAction
): BoardState {
  switch (action.type) {
    case "INIT_SUCCESS":
      return { status: "ready", board: action.board, selectedCardId: null };
    case "INIT_ERROR":
      return {
        status: "error",
        board: null,
        selectedCardId: null,
        errorMessage: action.message,
      };

    case "CARD_SELECT":
      return { ...state, selectedCardId: action.cardId };
    case "CARD_DESELECT":
      return { ...state, selectedCardId: null };

    default: {
      if (!state.board || state.status !== "ready") return state;

      const board = state.board;
      switch (action.type) {
        case "BOARD_TITLE_SET":
          return { ...state, board: setBoardTitle(board, action.title) };

        case "LIST_ADD":
          return {
            ...state,
            board: addList(board, action.title ?? "New List"),
          };

        case "LIST_TITLE_SET":
          return {
            ...state,
            board: renameList(board, action.listId, action.title),
          };

        case "LIST_DELETE": {
          const next = deleteList(board, action.listId);

          const selected = state.selectedCardId;
          if (!selected) return { ...state, board: next };
          const stillExists = next.lists.some((l) =>
            l.cards.some((c) => c.id === selected)
          );
          return {
            ...state,
            board: next,
            selectedCardId: stillExists ? selected : null,
          };
        }

        case "LISTS_REORDER":
          return {
            ...state,
            board: reorderLists(board, action.orderedListIds),
          };

        case "CARD_ADD":
          return {
            ...state,
            board: addCard(board, action.listId, action.title ?? "New Card"),
          };

        case "CARD_TITLE_SET":
          return {
            ...state,
            board: renameCard(board, action.cardId, action.title),
          };

        case "CARD_DELETE": {
          const next = deleteCard(board, action.cardId);
          return {
            ...state,
            board: next,
            selectedCardId:
              state.selectedCardId === action.cardId
                ? null
                : state.selectedCardId,
          };
        }

        case "CARDS_REORDER":
          return {
            ...state,
            board: reorderCards(board, action.listId, action.orderedCardIds),
          };

        case "CARD_MOVE_BETWEEN":
          return {
            ...state,
            board: moveCardBetweenLists(
              board,
              action.cardId,
              action.fromListId,
              action.toListId,
              action.toIndex
            ),
          };

        case "CARD_MOVE_WITHIN":
          return {
            ...state,
            board: moveCardWithinList(
              board,
              action.listId,
              action.fromIndex,
              action.toIndex
            ),
          };

        case "COMMENT_ADD":
          return {
            ...state,
            board: addCommentToCard(
              board,
              action.cardId,
              action.text,
              action.author
            ),
          };

        case "COMMENT_DELETE":
          return {
            ...state,
            board: deleteCommentFromCard(
              board,
              action.cardId,
              action.commentId
            ),
          };

        default:
          return state;
      }
    }
  }
}
