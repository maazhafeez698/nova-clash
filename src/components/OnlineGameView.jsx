import { useCallback, useEffect } from "react";
import Board from "./Board.jsx";
import UltimateBoard from "./UltimateBoard.jsx";
import StatusBar from "./StatusBar.jsx";
import InviteLobby from "./InviteLobby.jsx";
import { usePeerConnection } from "../hooks/usePeerConnection.js";
import { useOnlineClassicGame } from "../hooks/useOnlineClassicGame.js";
import { useOnlineUltimateGame } from "../hooks/useOnlineUltimateGame.js";
import { parseInviteCode } from "../game/inviteCode.js";

function LeaveLink({ onLeave }) {
  return (
    <button
      type="button"
      onClick={onLeave}
      className="self-center text-xs text-ink-faint hover:text-ink-muted transition-colors"
    >
      Leave match
    </button>
  );
}

function OnlineClassicMatch({
  connection,
  mySymbol,
  onRoundEnd,
  onLeave,
  sound,
}) {
  const handleRoundEnd = useCallback(
    (result) => {
      if (result.winner) sound.playWin();
      else sound.playDraw();
      onRoundEnd(result);
    },
    [sound, onRoundEnd],
  );

  const {
    board,
    current,
    winner,
    winLine,
    isDraw,
    isOver,
    isMyTurn,
    placeMark,
    reset,
  } = useOnlineClassicGame(connection, mySymbol, {
    onMove: sound.playMove,
    onRoundEnd: handleRoundEnd,
  });

  return (
    <>
      <div className="relative flex-1 min-h-0 aspect-square max-w-full mx-auto overflow-hidden">
        <Board
          board={board}
          winLine={winLine}
          onCellClick={placeMark}
          disabled={isOver || !isMyTurn}
          currentPlayer={current}
        />
      </div>
      <StatusBar
        current={current}
        winner={winner}
        isDraw={isDraw}
        onRestart={() => {
          sound.playClick();
          reset();
        }}
        hint={!isOver && !isMyTurn ? "Waiting on your friend…" : undefined}
        perspective={mySymbol}
        opponentLabel="Your opponent"
      />
      <LeaveLink onLeave={onLeave} />
    </>
  );
}

function OnlineUltimateMatch({
  connection,
  mySymbol,
  onRoundEnd,
  onLeave,
  sound,
}) {
  const handleRoundEnd = useCallback(
    (result) => {
      if (result.winner) sound.playWin();
      else sound.playDraw();
      onRoundEnd(result);
    },
    [sound, onRoundEnd],
  );

  const game = useOnlineUltimateGame(connection, mySymbol, {
    onMove: sound.playMove,
    onRoundEnd: handleRoundEnd,
  });
  const {
    current,
    overallWinner,
    isDraw,
    isOver,
    isMyTurn,
    placeMark,
    reset,
    activeBoard,
  } = game;

  const hint = isOver
    ? undefined
    : !isMyTurn
      ? "Waiting on your friend…"
      : activeBoard === null
        ? "Free choice — play in any open board"
        : `Sent to board ${activeBoard + 1}`;

  return (
    <>
      <div className="relative flex-1 min-h-0 aspect-square max-w-full mx-auto overflow-hidden">
        <UltimateBoard
          state={game}
          onCellClick={placeMark}
          disabled={isOver || !isMyTurn}
        />
      </div>
      <StatusBar
        current={current}
        winner={overallWinner}
        isDraw={isDraw}
        onRestart={() => {
          sound.playClick();
          reset();
        }}
        hint={hint}
        perspective={mySymbol}
        opponentLabel="Your opponent"
      />
      <LeaveLink onLeave={onLeave} />
    </>
  );
}

/** @param {{ mode: 'classic'|'ultimate', onRoundEnd: (result: object) => void, onMatchStart?: () => void, sound: ReturnType<typeof import('../hooks/useSound.js').useSound> }} props */
export default function OnlineGameView({
  mode,
  onRoundEnd,
  onMatchStart,
  sound,
}) {
  const peer = usePeerConnection();

  useEffect(() => {
    if (peer.status === "connected") onMatchStart?.();
  }, [peer.status, onMatchStart]);

  const resolvedMode =
    peer.role === "guest"
      ? (parseInviteCode(peer.inviteCode)?.mode ?? mode)
      : mode;
  const mySymbol = peer.role === "host" ? "X" : "O";

  const handleCreate = useCallback(() => {
    sound.playClick();
    peer.createInvite(mode);
  }, [peer, mode, sound]);

  const handleJoin = useCallback(
    (rawCode) => {
      sound.playClick();
      const parsed = parseInviteCode(rawCode);
      if (!parsed)
        return { ok: false, message: "That code doesn't look right." };
      peer.joinInvite(parsed.code);
      return { ok: true };
    },
    [peer, sound],
  );

  const handleLeave = useCallback(() => {
    sound.playClick();
    peer.reset();
  }, [peer, sound]);

  if (peer.status !== "connected" || !peer.connection) {
    return (
      <InviteLobby
        mode={mode}
        status={peer.status}
        inviteCode={peer.inviteCode}
        errorMessage={peer.errorMessage}
        onCreate={handleCreate}
        onJoin={handleJoin}
        onCancel={peer.reset}
      />
    );
  }

  return resolvedMode === "ultimate" ? (
    <OnlineUltimateMatch
      connection={peer.connection}
      mySymbol={mySymbol}
      onRoundEnd={onRoundEnd}
      onLeave={handleLeave}
      sound={sound}
    />
  ) : (
    <OnlineClassicMatch
      connection={peer.connection}
      mySymbol={mySymbol}
      onRoundEnd={onRoundEnd}
      onLeave={handleLeave}
      sound={sound}
    />
  );
}
