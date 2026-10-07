'use client'
import React, { useEffect, useRef } from 'react'

function VideoRoom({ roomId }: { roomId: string }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const zpRef = useRef<any>(null);

    useEffect(() => {
        const start = async () => {
            const { ZegoUIKitPrebuilt } = await import("@zegocloud/zego-uikit-prebuilt");

            const userId = crypto.randomUUID();

            const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
                Number(process.env.NEXT_PUBLIC_APP_ID),
                process.env.NEXT_PUBLIC_SERVER_SECRET!,
                roomId,
                userId,
                "Stranger"
            );

            const zp = ZegoUIKitPrebuilt.create(kitToken);
            zpRef.current = zp;

            zp.joinRoom({
                container: containerRef.current!,
                scenario: {
                    mode: ZegoUIKitPrebuilt.VideoConference,
                },
            });
        };

        start();

        return () => {
            zpRef.current?.destroy(); // cleanup (important)
        };

    }, [roomId]);

    return <div ref={containerRef} style={{ width: "100%", height: "100vh" }} />;
}

export default VideoRoom;