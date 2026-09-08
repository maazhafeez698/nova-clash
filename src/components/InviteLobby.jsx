import { useState } from "react";

export default function InviteLobby({
  mode,
  status,
  inviteCode,
  errorMessage,
  onCreate,
  onJoin,
  onCancel,
}) {
  const [view, setView] = useState("choose");
  const [joinInput, setJoinInput] = useState("");
  const [joinError, setJoinError] = useState(null);

  const handleHost = () => {
    setView("host");
    onCreate();
  };

  const handleJoinSubmit = (event) => {
    event.preventDefault();
    const result = onJoin(joinInput);
    setJoinError(result?.ok === false ? result.message : null);
  };

  const handleCopy = async () => {
    if (!inviteCode) return;
    try {
      await navigator.clipboard.writeText(inviteCode);
    } catch {}
  };

  const handleBack = () => {
    setView("choose");
    setJoinError(null);
    onCancel();
  };

  const cardClass =
    "w-full rounded-2xl border border-void-line bg-void-surface p-6 flex flex-col items-center gap-4 text-center";

  if (view === "choose") {
    return (
      <div className={cardClass}>
        <p className="text-sm text-ink-muted">
          Play {mode === "ultimate" ? "Ultimate" : "Classic"} with a friend on
          another device.
        </p>
        <div className="flex flex-col sm:flex-row gap-2.5 w-full">
          <button
            type="button"
            onClick={handleHost}
            className="flex-1 rounded-lg bg-void-raised border border-void-line hover:border-cyan/50 text-ink font-medium py-2.5 transition-colors"
          >
            Host a game
          </button>
          <button
            type="button"
            onClick={() => setView("join")}
            className="flex-1 rounded-lg bg-void-raised border border-void-line hover:border-amber/50 text-ink font-medium py-2.5 transition-colors"
          >
            Join a game
          </button>
        </div>
      </div>
    );
  }

  if (view === "host") {
    return (
      <div className={cardClass}>
        <p className="text-xs text-ink-faint uppercase tracking-wide">
          Your invite code
        </p>
        {inviteCode ? (
          <button
            type="button"
            onClick={handleCopy}
            title="Tap to copy"
            className="font-display text-3xl tracking-[0.2em] text-cyan border border-cyan/40 rounded-xl px-6 py-3 hover:bg-cyan/10 transition-colors"
          >
            {inviteCode}
          </button>
        ) : (
          <div className="h-[3.75rem]" />
        )}
        <p className="text-sm text-ink-muted">
          {status === "error"
            ? errorMessage
            : "Waiting for your friend to join…"}
        </p>
        <button
          type="button"
          onClick={handleBack}
          className="text-sm text-ink-faint hover:text-ink-muted"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <div className={cardClass}>
      <form
        onSubmit={handleJoinSubmit}
        className="w-full flex flex-col items-center gap-3"
      >
        <p className="text-xs text-ink-faint uppercase tracking-wide">
          Enter invite code
        </p>
        <input
          type="text"
          value={joinInput}
          onChange={(event) => setJoinInput(event.target.value)}
          placeholder="CLS-7F3QK"
          autoCapitalize="characters"
          autoComplete="off"
          spellCheck={false}
          className="w-full max-w-[14rem] text-center font-display text-2xl tracking-[0.15em] uppercase bg-void-deep border border-void-line focus:border-cyan/50 rounded-xl px-4 py-2.5 text-ink placeholder:text-ink-faint/60"
        />
        <button
          type="submit"
          disabled={status === "connecting"}
          className="w-full max-w-[14rem] rounded-lg bg-void-raised border border-void-line hover:border-cyan/50 text-ink font-medium py-2.5 transition-colors disabled:opacity-50"
        >
          {status === "connecting" ? "Connecting…" : "Join"}
        </button>
      </form>
      {(joinError || (status === "error" && errorMessage)) && (
        <p className="text-sm text-nova">{joinError ?? errorMessage}</p>
      )}
      <button
        type="button"
        onClick={handleBack}
        className="text-sm text-ink-faint hover:text-ink-muted"
      >
        Back
      </button>
    </div>
  );
}
