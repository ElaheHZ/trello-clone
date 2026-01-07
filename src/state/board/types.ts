import type { Board, Id } from "../../domain/board/models";

export type BoardStatus = "booting" | "ready" | "error";

export interface BoardState {
  status: BoardStatus;
  board: Board | null;
  selectedCardId: Id | null;
  errorMessage?: string;
}
