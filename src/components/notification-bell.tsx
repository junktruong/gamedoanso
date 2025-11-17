"use client";

import Pusher from "pusher-js";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Bell } from "lucide-react"; // nếu bạn dùng lucide, hoặc tự thay icon
import { Button } from "@src/components/ui/button";
import { useToast } from "@src/components/ui/use-toast";

interface RealtimePayload {
    message: string;
    amount: number;
    newScore: number;
}

export function NotificationBell() {
    const { data: session } = useSession();
    const { toast } = useToast();
    const [unread, setUnread] = useState(0);

    useEffect(() => {
        if (!session?.user?.id) return;

        const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
            cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
        });

        const channelName = `user-${session.user.id}`;
        const channel = pusher.subscribe(channelName);

        channel.bind("score-added", (data: RealtimePayload) => {
            setUnread((prev) => prev + 1);
            toast({
                title: "Bạn vừa được cộng điểm 🎉",
                description: data.message,
            });
        });

        return () => {
            channel.unbind_all();
            channel.unsubscribe();
            pusher.disconnect();
        };
    }, [session?.user?.id, toast]);

    if (!session?.user) return null;

    return (
        <Button
            variant="ghost"
            size="icon"
            className="relative"
            aria-label="Notifications"
        >
            <Bell className="w-5 h-5" />
            {unread > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full px-1">
                    {unread}
                </span>
            )}
        </Button>
    );
}
