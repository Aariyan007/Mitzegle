"use client";
import { useEffect, useRef, useState } from "react";
import { fetchZegoToken } from "../lib/api";

export default function VideoRoom({ roomId, onSkip, onLeave }: {
  roomId: string; onSkip: () => void; onLeave: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let zp: { destroy: () => void } | null = null;
    let cancelled = false;
    (async () => {
      try {
        const [{ token, appId }, { ZegoUIKitPrebuilt }] = await Promise.all([
          fetchZegoToken(roomId),
          import("@zegocloud/zego-uikit-prebuilt"),
        ]);
        if (cancelled || !containerRef.current) return;
        const userId = crypto.randomUUID();
        const kit = ZegoUIKitPrebuilt.generateKitTokenForProduction(appId, token, roomId, userId, "Stranger");
        const instance = ZegoUIKitPrebuilt.create(kit);
        zp = instance;
        instance.joinRoom({
          container: containerRef.current,
          scenario: { mode: ZegoUIKitPrebuilt.VideoConference },
          showLeavingView: false,
          showPreJoinView: false,
          showRoomTimer: false,
          showUserList: false,
          onLeaveRoom: onLeave,
        });
      } catch (e) {
        setError((e as Error).message);
      }
    })();
    return () => { cancelled = true; zp?.destroy(); };
  }, [roomId]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="relative w-full h-screen pt-16">
      {error && <p className="absolute top-20 left-1/2 -translate-x-1/2 text-red-300 z-20">{error}</p>}
      <div ref={containerRef} className="w-full h-full" />
      <button onClick={onSkip}
        className="absolute bottom-24 right-6 z-20 px-6 py-3 rounded-full bg-green-600 hover:bg-green-500 text-white font-semibold">
        Skip
      </button>
    </div>
  );
}
