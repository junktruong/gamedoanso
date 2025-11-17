"use client";

import { Toast } from "./toast";
import { useToastContext } from "./toast-provider";

export function Toaster() {
    const { toasts } = useToastContext();

    return (
        <div className="fixed top-4 right-4 z-50 space-y-2">
            {toasts.map((t) => (
                <Toast key={t.id} title={t.title} description={t.description} />
            ))}
        </div>
    );
}
