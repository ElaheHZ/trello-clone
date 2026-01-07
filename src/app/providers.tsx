"use client";

import type { ReactNode } from "react";
import { BoardStoreProvider } from "../state/board/store";

export default function Providers({ children }: { children: ReactNode }) {
  return <BoardStoreProvider>{children}</BoardStoreProvider>;
}
