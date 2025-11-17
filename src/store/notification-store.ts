import { create } from "zustand";

interface NotificationState {
    score: number | null;
    latestNotification: string | null;

    setScore: (score: number) => void;
    setLatestNotification: (msg: string) => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
    score: null,
    latestNotification: null,

    setScore: (score) => set({ score }),
    setLatestNotification: (msg) => set({ latestNotification: msg }),
}));
