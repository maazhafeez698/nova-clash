// Invite codes are short, shareable strings that also encode which game mode
// the host is running — e.g. "CLS-7F3QK" for Classic, "ULT-7F3QK" for
// Ultimate — so a guest never has to separately agree on a mode, they just
// type the code they were given.

const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O or 1/I — easy to read aloud
const CODE_LENGTH = 5;

const MODE_TO_PREFIX = { classic: "CLS", ultimate: "ULT" };
const PREFIX_TO_MODE = { CLS: "classic", ULT: "ultimate" };

function randomSegment(length) {
  let out = "";
  for (let i = 0; i < length; i++) {
    out += CODE_ALPHABET[Math.floor(Math.random() * CODE_ALPHABET.length)];
  }
  return out;
}

/** @param {'classic'|'ultimate'} mode */
export function generateInviteCode(mode) {
  return `${MODE_TO_PREFIX[mode]}-${randomSegment(CODE_LENGTH)}`;
}

/**
 * @param {string} raw - whatever the guest typed/pasted
 * @returns {{ mode: 'classic'|'ultimate', code: string } | null}
 */
export function parseInviteCode(raw) {
  const cleaned = String(raw).trim().toUpperCase().replace(/\s+/g, "");
  const match = /^(CLS|ULT)-?([A-Z0-9]{4,8})$/.exec(cleaned);
  if (!match) return null;

  const [, prefix, segment] = match;
  return { mode: PREFIX_TO_MODE[prefix], code: `${prefix}-${segment}` };
}
