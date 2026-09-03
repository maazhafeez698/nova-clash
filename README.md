# Nova Clash

A constellation-themed, strategic Tic Tac Toe — built with React, Tailwind CSS, and Bun.

Not the three-in-a-row you've built a hundred times: Nova Clash ships **Classic** and
**Ultimate** (nine boards in one) modes, three AI difficulties — including a genuinely
unbeatable minimax core — live persistent scoring, and a fully synthesized sound design.
No audio files, no backend, no dependencies beyond React itself. All frontend.

## Features

- **Classic mode** — the 3×3 you know, with animated hand-drawn marks and a glowing
  win line.
- **Ultimate mode** — a 3×3 grid of 3×3 boards. The cell you play sends your opponent
  to the matching sub-board next; win three sub-boards in a row to take the match. Real
  strategic depth, still playable in a couple of minutes.
- **AI opponents** at three difficulties:
  - *Easy* — plays randomly.
  - *Medium* — takes winning moves and blocks yours, otherwise plays positionally.
  - *Unbeatable* — full minimax search with alpha-beta pruning in Classic mode; a
    tuned heuristic (win/block detection + safe hand-offs) in Ultimate mode, where a
    full game-tree search isn't tractable in the browser.
- **Play as X or O**, switch opponent type and difficulty any time — the board resets
  cleanly whenever the setup changes.
- **Live scoreboard** persisted to `localStorage`, with a one-click reset.
- **Synthesized sound** via the Web Audio API — distinct tones for moves, wins, draws,
  and UI clicks — with a mute toggle that's also remembered between visits.
- **Accessible by default** — every cell is a real `<button>`, focus states are
  visible, round outcomes are announced via `aria-live`, and all animation respects
  `prefers-reduced-motion`.
- **Responsive** from small phones up, no horizontal scroll, no layout shift.

## Stack

- [Bun](https://bun.sh) — package manager & dev runtime
- [Vite](https://vitejs.dev) — build tool
- [React 18](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)

## Getting started

```bash
bun install
bun run dev
```

Open the local URL Vite prints (defaults to `http://localhost:5173`).

Other scripts:

```bash
bun run build     # production build to dist/
bun run preview   # preview the production build locally
```

## Project structure

```
src/
  components/     UI components (Board, UltimateBoard, ControlBar, ScorePanel, ...)
  game/           Pure game logic — win detection, AI, Ultimate-mode rules, sound
  hooks/          React state machines (useClassicGame, useUltimateGame, useSound, ...)
  App.jsx         Top-level layout & shared match configuration
```

Game rules and AI are plain, framework-free functions under `src/game/` — they're
unit-testable in isolation from React if you want to extend them.

## How Ultimate mode works

1. The board is a 3×3 grid of 3×3 boards.
2. Whichever cell (1–9, left-to-right/top-to-bottom) you play in your sub-board sends
   your opponent to the matching sub-board next.
3. If that sub-board is already won or full, your opponent may play in any open board.
4. Win a sub-board with a normal three-in-a-row; win three sub-boards in a row on the
   meta-grid to win the match.

## Build status

- [x] Phase 1 — Project scaffold (Bun + Vite + React + Tailwind, design tokens)
- [x] Phase 2 — Classic mode game engine & UI
- [x] Phase 3 — AI opponents (Easy / Medium / Unbeatable)
- [x] Phase 4 — Ultimate Tic Tac Toe mode
- [x] Phase 5 — Scoring, sound design & animation polish
- [x] Phase 6 — Accessibility pass & docs

Full commit history (one commit per phase) is included in this repo — run `git log`
to see it.
