import type { Board, Card, Comment, List } from "./models";
import { createId } from "../../shared/id";
import { nowMs } from "../../shared/time";

export function createBoard(title: string): Board {
  const t = nowMs();
  return {
    id: createId(),
    title,
    lists: [],
    createdAtMs: t,
    updatedAtMs: t,
  };
}

export function createList(boardId: string, title: string, order: number): List {
  return {
    id: createId(),
    title,
    boardId,
    cards: [],
    order,
  };
}

export function createCard(listId: string, title: string, order: number): Card {
  return {
    id: createId(),
    title,
    listId,
    comments: [],
    order,
  };
}

export function createComment(text: string, author: string): Comment {
  return {
    id: createId(),
    text,
    author,
    createdAtMs: nowMs(),
  };
}

export function createDemoBoard(): Board {
  const board = createBoard("Demo Board");

  const todo = createList(board.id, "To Do", 0);
  const inProgress = createList(board.id, "In Progress", 1);
  const done = createList(board.id, "Done", 2);

  todo.cards = [
    {
      ...createCard(todo.id, "Design new landing page", 0),
      comments: [
        {
          ...createComment("Should include hero section and features", "John"),
          createdAtMs: nowMs() - 3_600_000,
        },
      ],
    },
    createCard(todo.id, "Setup development environment", 1),
    createCard(todo.id, "Write documentation", 2),
  ];

  inProgress.cards = [
    {
      ...createCard(inProgress.id, "Implement user authentication", 0),
      comments: [
        {
          ...createComment("Using JWT tokens", "Sarah"),
          createdAtMs: nowMs() - 7_200_000,
        },
        {
          ...createComment("Password reset flow needs testing", "Mike"),
          createdAtMs: nowMs() - 3_600_000,
        },
      ],
    },
    createCard(inProgress.id, "Database schema design", 1),
  ];

  done.cards = [
    createCard(done.id, "Project kickoff meeting", 0),
    {
      ...createCard(done.id, "Gather requirements", 1),
      comments: [
        {
          ...createComment("All stakeholders signed off", "Admin"),
          createdAtMs: nowMs() - 86_400_000,
        },
      ],
    },
  ];

  board.lists = [todo, inProgress, done];
  board.updatedAtMs = nowMs();
  return board;
}
