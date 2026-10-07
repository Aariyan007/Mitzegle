import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { API_URL } from "../lib/api";

export function useSocket(token: string | null) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [authFailed, setAuthFailed] = useState(false);

  useEffect(() => {
    if (!token) return;
    const s = io(API_URL, { transports: ["websocket"], auth: { token } });
    setSocket(s);
    setAuthFailed(false);
    s.on("connect", () => setConnected(true));
    s.on("disconnect", () => setConnected(false));
    s.on("connect_error", (e) => {
      if (e.message === "unauthorized" || e.message === "forbidden") {
        setAuthFailed(true);
        s.disconnect();
      }
    });
    s.on("kicked", () => setAuthFailed(true));
    return () => { s.disconnect(); setSocket(null); setConnected(false); };
  }, [token]);

  return { socket, connected, authFailed };
}
