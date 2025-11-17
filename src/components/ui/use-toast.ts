"use client";

import { useToastContext } from "./toast-provider";

export function useToast() {
    const { addToast } = useToastContext();

    function toast({ title, description }: { title: string; description?: string }) {
        addToast({ title, description });
    }

    return { toast };
}
