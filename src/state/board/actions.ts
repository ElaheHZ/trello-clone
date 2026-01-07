import type { Board, Id } from "../../domain/board/models";

export type BoardAction =
  | { type: "INIT_SUCCESS"; board: Board }
  | { type: "INIT_ERROR"; message: string }
  | { type: "BOARD_TITLE_SET"; title: string }
  | { type: "LIST_ADD"; title?: string }
  | { type: "LIST_TITLE_SET"; listId: Id; title: string }
  | { type: "LIST_DELETE"; listId: Id }
  | { type: "LISTS_REORDER"; orderedListIds: Id[] }
  | { type: "CARD_ADD"; listId: Id; title?: string }
  | { type: "CARD_TITLE_SET"; cardId: Id; title: string }
  | { type: "CARD_DELETE"; cardId: Id }
  | { type: "CARD_MOVE_BETWEEN"; cardId: Id; fromListId: Id; toListId: Id; toIndex: number }
  | { type: "CARD_MOVE_WITHIN"; listId: Id; fromIndex: number; toIndex: number }
  | { type: "CARDS_REORDER"; listId: Id; orderedCardIds: Id[] }
  | { type: "COMMENT_ADD"; cardId: Id; text: string; author: string }
  | { type: "COMMENT_DELETE"; cardId: Id; commentId: Id }
  | { type: "CARD_SELECT"; cardId: Id }
  | { type: "CARD_DESELECT" };
