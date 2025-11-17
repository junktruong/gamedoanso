"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useToast } from "@src/components/ui/use-toast";
import { getSocket } from "@src/lib/socket-client";
import { useNotificationStore } from "@src/store/notification-store";

export default function UserScoreListener() {
    const { data: session } = useSession();
    const { toast } = useToast();
    const setScore = useNotificationStore((s) => s.setScore);
    const setLatestNotification = useNotificationStore((s) => s.setLatestNotification);

    useEffect(() => {
        if (!session?.user?.id) return;

        const socket = getSocket();

        socket.emit("identify", session.user.id);

        socket.on("notify", (data) => {
            console.log("📥 Notify received:", data);

            // Lưu vào store
            if (data?.newScore !== undefined) setScore(data.newScore);
            if (data?.message) setLatestNotification(data.message);

            // Hiện toast
            toast({
                title: "🎉 Bạn được cộng điểm!",
                description: data.message,
            });
        });

        return () => {
            socket.off("notify");
        };
    }, [session?.user?.id]);

    return null;
}
