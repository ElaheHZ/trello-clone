import "../reset.scss";
import Providers from "./providers";
import type { ReactNode } from "react";

export const metadata = {
  title: "Trello Clone",
  description: "A minimal Trello-like board built with Next.js",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
