# Trello Clone (Next.js)

A simple Trello-like board built with Next.js (App Router), TypeScript, SCSS Modules, and @dnd-kit.  
State + logic are refactored into a clean layered architecture (domain → state → storage → UI).

## Tech

- Next.js (App Router)
- React + TypeScript
- SCSS Modules
- @dnd-kit (drag & drop)
- LocalStorage persistence (repository pattern)

## Getting Started

pnpm install
pnpm dev
Open http://localhost:3000.

## Scripts

pnpm dev # run locally
pnpm build # production build
pnpm start # run production build
pnpm lint # lint

## Project Structure

- src/domain/board/\* – pure domain logic (operations, types)
- src/state/board/\* – reducer + actions (application state)
- src/infrastructure/storage/\* – persistence (LocalStorage repository + migration)
- src/presentation/\* – UI and interaction hooks (dnd, components)

## Data Storage

Board data is stored in localStorage. If an older format exists, it auto-migrates on load.
