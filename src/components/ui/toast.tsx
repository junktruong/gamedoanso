"use client";

export function Toast({ title, description }: { title: string; description?: string }) {
    return (
        <div className="bg-white border shadow-lg rounded px-4 py-3 w-[280px]">
            <p className="font-semibold">{title}</p>
            {description && (
                <p className="text-sm text-gray-600 mt-1">{description}</p>
            )}
        </div>
    );
}
