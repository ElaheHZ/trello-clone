"use client";

import React, { createContext, useContext, useEffect, useMemo, useReducer } from "react";
import type { ReactNode } from "react";
import type { BoardState } from "./types";
import type { BoardAction } from "./actions";
import { boardReducer, initialBoardState } from "./reducer";
import { LocalStorageBoardRepository } from "../../infrastructure/storage/localStorageBoardRepository";

const BoardStateContext = createContext<BoardState | null>(null);
const BoardDispatchContext = createContext<React.Dispatch<BoardAction> | null>(null);

const repo = new LocalStorageBoardRepository();

export function BoardStoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(boardReducer, initialBoardState);


  useEffect(() => {
    try {
      const board = repo.load();
      if (!board) {
        dispatch({ type: "INIT_ERROR", message: "Failed to load board" });
        return;
      }
      dispatch({ type: "INIT_SUCCESS", board });
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      dispatch({ type: "INIT_ERROR", message: msg });
    }
  }, []);


  useEffect(() => {
    if (state.status !== "ready" || !state.board) return;
    repo.save(state.board);
  }, [state.status, state.board]);

  const dispatchValue = useMemo(() => dispatch, [dispatch]);

  return (
    <BoardStateContext.Provider value={state}>
      <BoardDispatchContext.Provider value={dispatchValue}>
        {children}
      </BoardDispatchContext.Provider>
    </BoardStateContext.Provider>
  );
}

export function useBoardState() {
  const ctx = useContext(BoardStateContext);
  if (!ctx) throw new Error("useBoardState must be used within BoardStoreProvider");
  return ctx;
}

export function useBoardDispatch() {
  const ctx = useContext(BoardDispatchContext);
  if (!ctx) throw new Error("useBoardDispatch must be used within BoardStoreProvider");
  return ctx;
}
