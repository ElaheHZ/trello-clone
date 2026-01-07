import type { Board } from "../../domain/board/models";

export interface BoardRepository {
  load(): Board | null;
  save(board: Board): void;
  clear(): void;
}
