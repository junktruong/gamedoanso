"use client";

import React, { createContext, useContext, useState } from "react";

interface ToastItem {
    id: number;
    title: string;
    description?: string;
}

interface ToastContextValue {
    toasts: ToastItem[];
    addToast: (toast: Omit<ToastItem, "id">) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<ToastItem[]>([]);

    function addToast(toast: Omit<ToastItem, "id">) {
        const id = Date.now();
        setToasts((prev) => [...prev, { ...toast, id }]);

        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 4000);
    }

    return (
        <ToastContext.Provider value={{ toasts, addToast }}>
            {children}
        </ToastContext.Provider>
    );
}

export function useToastContext() {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error("useToastContext must be used inside ToastProvider");
    return ctx;
}
