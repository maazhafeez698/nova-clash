import { useCallback, useEffect, useRef, useState } from "react";
import Peer from "peerjs";
import { generateInviteCode } from "../game/inviteCode.js";

const PEER_ID_PREFIX = "novaclash";

const peerIdFor = (code) => `${PEER_ID_PREFIX}-${code}`;

export function usePeerConnection() {
  const peerRef = useRef(null);
  const connectionRef = useRef(null);

  const [status, setStatus] = useState("idle");
  const [role, setRole] = useState(null);
  const [inviteCode, setInviteCode] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [connection, setConnection] = useState(null);

  const teardown = useCallback(() => {
    connectionRef.current?.close();
    peerRef.current?.destroy();
    connectionRef.current = null;
    peerRef.current = null;
  }, []);

  useEffect(() => teardown, [teardown]);

  const bindConnection = useCallback((conn) => {
    connectionRef.current = conn;

    conn.on("open", () => {
      setConnection(conn);
      setStatus("connected");
    });
    conn.on("close", () => {
      setStatus("closed");
      setConnection(null);
    });
    conn.on("error", () => {
      setStatus("error");
      setErrorMessage("Connection to your opponent was lost.");
    });
  }, []);

  const createInvite = useCallback(
    (mode) => {
      teardown();
      setErrorMessage(null);
      setRole("host");
      setStatus("waiting");

      const code = generateInviteCode(mode);
      setInviteCode(code);

      const peer = new Peer(peerIdFor(code));
      peerRef.current = peer;

      peer.on("connection", (conn) => bindConnection(conn));
      peer.on("error", (err) => {
        setStatus("error");
        setErrorMessage(
          err?.type === "unavailable-id"
            ? "That code is already taken — try hosting again."
            : "Could not start hosting. Check your connection and try again.",
        );
      });
    },
    [bindConnection, teardown],
  );

  const joinInvite = useCallback(
    (code) => {
      teardown();
      setErrorMessage(null);
      setRole("guest");
      setStatus("connecting");
      setInviteCode(code);

      const peer = new Peer();
      peerRef.current = peer;

      peer.on("open", () => {
        const conn = peer.connect(peerIdFor(code), { reliable: true });
        bindConnection(conn);
      });
      peer.on("error", (err) => {
        setStatus("error");
        setErrorMessage(
          err?.type === "peer-unavailable"
            ? "No game found with that code — double-check it and try again."
            : "Could not connect. Check your connection and try again.",
        );
      });
    },
    [bindConnection, teardown],
  );

  const reset = useCallback(() => {
    teardown();
    setStatus("idle");
    setRole(null);
    setInviteCode(null);
    setErrorMessage(null);
    setConnection(null);
  }, [teardown]);

  return {
    status,
    role,
    inviteCode,
    errorMessage,
    connection,
    createInvite,
    joinInvite,
    reset,
  };
}
