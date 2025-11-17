// app/profile/profile-client.tsx
"use client";

import type { User } from "@prisma/client";

import { useState } from "react";
import { Button } from "@src/components/ui/button";

interface Props {
    user: User;
}

export default function ProfileClient({ user }: Props) {
    const [name, setName] = useState(user.name ?? "");
    const [image, setImage] = useState(user.image ?? "");
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/profile", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, image }),
            });

            if (!res.ok) throw new Error("Failed");
            alert("Cập nhật thành công! (F5 để thấy trên navbar)");
        } catch (e) {
            console.error(e);
            alert("Cập nhật thất bại");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-4 max-w-md">
            <h1 className="text-2xl font-bold">Chỉnh sửa thông tin</h1>
            <div className="space-y-2">
                <label className="text-sm font-medium">Tên hiển thị</label>
                <input
                    className="w-full border rounded px-3 py-2 text-sm"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nhập tên..."
                />
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium">Avatar URL</label>
                <input
                    className="w-full border rounded px-3 py-2 text-sm"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="https://..."
                />
            </div>
            <Button onClick={handleSave} disabled={loading}>
                {loading ? "Đang lưu..." : "Lưu"}
            </Button>
        </div>
    );
}
