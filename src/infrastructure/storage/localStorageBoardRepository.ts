import type { Board, Card, Comment, List } from "../../domain/board/models";
import type { BoardRepository } from "./boardRepository";
import { createDemoBoard } from "../../domain/board/factory";

type AnyRecord = Record<string, unknown>;

const KEY_V2 = "trello_board_v2";
const KEY_LEGACY = "trello_board";

function isRecord(v: unknown): v is AnyRecord {
  return typeof v === "object" && v !== null;
}

function toMs(value: unknown): number {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const n = Number(value);
    if (Number.isFinite(n)) return n;
    const d = new Date(value);
    const t = d.getTime();
    return Number.isFinite(t) ? t : Date.now();
  }
  if (value instanceof Date) return value.getTime();
  return Date.now();
}

function normalizeComment(raw: unknown): Comment | null {
  if (!isRecord(raw)) return null;
  const id = raw.id;
  const text = raw.text;
  const author = raw.author;
  if (
    typeof id !== "string" ||
    typeof text !== "string" ||
    typeof author !== "string"
  ) {
    return null;
  }
  return {
    id,
    text,
    author,
    createdAtMs: toMs(raw.createdAtMs ?? raw.createdAt),
  };
}

function normalizeCard(raw: unknown): Card | null {
  if (!isRecord(raw)) return null;
  const id = raw.id;
  const title = raw.title;
  const listId = raw.listId;
  if (
    typeof id !== "string" ||
    typeof title !== "string" ||
    typeof listId !== "string"
  ) {
    return null;
  }
  const commentsRaw = Array.isArray(raw.comments) ? raw.comments : [];
  const comments = commentsRaw
    .map(normalizeComment)
    .filter((c): c is Comment => Boolean(c));

  return {
    id,
    title,
    listId,
    comments,
    order: typeof raw.order === "number" ? raw.order : 0,
  };
}

function normalizeList(raw: unknown): List | null {
  if (!isRecord(raw)) return null;
  const id = raw.id;
  const title = raw.title;
  const boardId = raw.boardId;
  if (
    typeof id !== "string" ||
    typeof title !== "string" ||
    typeof boardId !== "string"
  ) {
    return null;
  }
  const cardsRaw = Array.isArray(raw.cards) ? raw.cards : [];
  const cards = cardsRaw
    .map(normalizeCard)
    .filter((c): c is Card => Boolean(c))
    .map((c) => ({ ...c, listId: id }));

  return {
    id,
    title,
    boardId,
    cards,
    order: typeof raw.order === "number" ? raw.order : 0,
  };
}

function normalizeBoard(raw: unknown): Board | null {
  if (!isRecord(raw)) return null;
  const id = raw.id;
  const title = raw.title;
  if (typeof id !== "string" || typeof title !== "string") return null;

  const listsRaw = Array.isArray(raw.lists) ? raw.lists : [];
  const lists = listsRaw
    .map(normalizeList)
    .filter((l): l is List => Boolean(l));

  return {
    id,
    title,
    lists,
    createdAtMs: toMs(raw.createdAtMs ?? raw.createdAt),
    updatedAtMs: toMs(raw.updatedAtMs ?? raw.updatedAt),
  };
}

function tryParseJson(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

export class LocalStorageBoardRepository implements BoardRepository {
  load(): Board | null {
    if (typeof window === "undefined") return null;

    const v2 = window.localStorage.getItem(KEY_V2);
    if (v2) {
      const parsed = tryParseJson(v2);
      const board = normalizeBoard(parsed);
      if (board) return board;
    }

    const legacy = window.localStorage.getItem(KEY_LEGACY);
    if (legacy) {
      const parsed = tryParseJson(legacy);
      const board = normalizeBoard(parsed);
      if (board) {
        this.save(board);
        return board;
      }
    }

    return createDemoBoard();
  }

  save(board: Board): void {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(KEY_V2, JSON.stringify(board));
  }

  clear(): void {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(KEY_V2);
  }
}
