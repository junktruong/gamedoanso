"use client";

import { useToast } from "@src/components/ui/use-toast";

function ToastRenderer() {
    const { ToastList } = useToast();
    return <ToastList />;
}

export default ToastRenderer;
