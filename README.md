# Nova Clash

A Tic Tac Toe app built with React, Tailwind CSS, and Bun. It supports a
9-board "Ultimate" variant, a built-in AI opponent, and two-device
multiplayer over an invite code.

## Features

- **Two game modes**
  - **Classic** — the standard 3×3 game.
  - **Ultimate** — a 3×3 grid of 3×3 boards. The cell you play in sends your
    opponent to the matching sub-board next; if that board is already won or
    full, they can play anywhere. Win three sub-boards in a row to win the
    match.
- **Three ways to play**
  - **Local PvP** — two people, one device, taking turns.
  - **Vs Nova AI** — play against the built-in AI at Easy, Medium, or
    Unbeatable. In Classic mode, Unbeatable is a full minimax search with
    alpha-beta pruning, so it genuinely cannot lose. In Ultimate mode,
    Unbeatable is a tuned heuristic (win/block detection plus board-position
    scoring) rather than a full search, since a complete game tree isn't
    practical to search in the browser — it plays strong but is not
    mathematically unbeatable.
  - **Invite Player** — play with someone on another device using a short
    invite code. See "How Invite Player works" below for what this actually
    requires.
- **Scoreboard** that persists across page reloads (via `localStorage`) and
  resets automatically whenever the setup changes — switching mode,
  opponent type, or which symbol you play all start a fresh board. Starting
  a new Invite Player match also resets it, even if you never changed those
  settings.
- **Sound effects** synthesized at runtime with the Web Audio API — no audio
  files. A mute toggle in the header is also remembered between visits.
- **Win/draw messages** are phrased for whoever is looking: Vs Nova AI and
  Invite Player show "You win" / "Nova wins" / "Your opponent wins"; Local
  PvP shows "X wins" / "O wins" since there's no single "you" when two
  people share one screen.
- **Fits one screen** — the whole layout is sized to the viewport height, no
  scrolling required, down to fairly short windows.
- Keyboard-operable (every cell is a real button), `aria-live` round
  announcements, visible focus states, and animations are disabled under
  `prefers-reduced-motion`.

## How Invite Player works

This is peer-to-peer over WebRTC, using [PeerJS](https://peerjs.com) purely
to help two browsers find each other — no game data passes through a
server. One person hosts (generates a code), the other joins with that code,
and moves are sent directly between the two browsers once connected.

The invite code encodes the game mode (e.g. `CLS-7F3QK` for Classic,
`ULT-7F3QK` for Ultimate), so the host picks the mode before creating the
code and the guest doesn't need to separately agree on it.

**Limitations of this approach, plainly:**

- It depends on PeerJS's free public broker server for the initial
  handshake. That's a third-party service this project doesn't control —
  fine for personal/casual use, not something to rely on for guaranteed
  uptime.
- The free tier has no TURN server, only STUN. On most home and mobile
  networks this connects without issue; on some restrictive corporate or
  school networks, the peer-to-peer connection can fail to establish.
- If the host changes the Classic/Ultimate mode toggle _while already
  connected_ to a guest, it only updates their own screen — it is not sent
  to the other side. Pick the mode before hosting.
- There's no reconnect if the connection drops mid-match; leave and start a
  new invite.
- Scores are local to each browser (`localStorage`), not shared between the
  two players — each side sees their own scoreboard, not a synced one.

## Stack

- [Bun](https://bun.sh) — package manager & dev runtime
- [Vite](https://vitejs.dev) — build tool
- [React 18](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [PeerJS](https://peerjs.com) — WebRTC signaling for Invite Player mode

## Getting started

```bash
bun install
bun run dev
```

Open the local URL Vite prints (defaults to `http://localhost:5173`).

```bash
bun run build
bun run preview
```

## Core Project structure

```
src/
  components/   UI components (Board, UltimateBoard, ControlBar, ScorePanel, ...)
  game/         Pure game logic — win detection, AI, Ultimate-mode rules,
                invite codes, sound synthesis. No React, no framework code.
  hooks/        React state — one hook per game mode (local Classic, local
                Ultimate, online Classic, online Ultimate), plus sound and
                the PeerJS connection wrapper.
  App.jsx       Top-level layout and shared match configuration
```

Game rules and AI live in `src/game/` as plain functions with no React
dependency, so they can be reasoned about (or tested) independently of the
UI.

## Known limitations

- No accounts, no server-side persistence — everything is local to a
  browser (`localStorage` for scores and mute state).
- Ultimate mode's "Unbeatable" AI is a strong heuristic, not a solved
  perfect player — see above.
- Invite Player has the WebRTC/PeerJS caveats listed above.
- Tested primarily in recent Chromium-based browsers; other browsers should
  work (nothing exotic is used) but haven't been specifically verified.
