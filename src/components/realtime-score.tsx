"use client";

import { useNotificationStore } from "@src/store/notification-store";

export function RealtimeScore() {
    const score = useNotificationStore((s) => s.score);


    return (
        <span className="font-bold">
            {score ?? "..."}
        </span>
    );
}
