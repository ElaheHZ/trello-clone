import type { TimestampMs } from "../../shared/time";

export type Id = string;

export interface Comment {
  id: Id;
  text: string;
  author: string;
  createdAtMs: TimestampMs;
}

export interface Card {
  id: Id;
  title: string;
  listId: Id;
  comments: Comment[];
  order: number;
}

export interface List {
  id: Id;
  title: string;
  boardId: Id;
  cards: Card[];
  order: number;
}

export interface Board {
  id: Id;
  title: string;
  lists: List[];
  createdAtMs: TimestampMs;
  updatedAtMs: TimestampMs;
}
