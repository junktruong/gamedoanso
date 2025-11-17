"use client";

import type { User } from "@prisma/client";
import { useState } from "react";
import { Button } from "@src/components/ui/button";

interface AdminUser extends User {
    setScore?: number;
    add?: number;
}

interface Props {
    initialUsers: User[];
}

export default function AdminClient({ initialUsers }: Props) {
    const [users, setUsers] = useState<AdminUser[]>(initialUsers);
    const [loadingId, setLoadingId] = useState<string | null>(null);

    const handleSetScore = async (id: string, score: number) => {
        setLoadingId(id);
        try {
            const res = await fetch("/api/admin/users/set", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, score }),
            });

            if (!res.ok) throw new Error("Failed");

            const updated = await res.json();
            setUsers((prev) =>
                prev.map((u) => (u.id === updated.id ? updated : u))
            );
        } catch (e) {
            console.error(e);
            alert("Set điểm thất bại");
        } finally {
            setLoadingId(null);
        }
    };

    const handleAddScore = async (id: string, amount: number) => {
        if (!amount) return;
        setLoadingId(id);
        try {
            const res = await fetch("/api/admin/users/add", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, amount }),
            });

            if (!res.ok) throw new Error("Failed");

            const updated = await res.json();
            setUsers((prev) =>
                prev.map((u) =>
                    u.id === updated.id ? { ...updated, add: 0 } : u
                )
            );
        } catch (e) {
            console.error(e);
            alert("Cộng điểm thất bại");
        } finally {
            setLoadingId(null);
        }
    };

    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-bold">Admin – Quản lý người dùng</h1>
            <table className="w-full text-sm border-collapse">
                <thead>
                    <tr className="border-b bg-slate-100">
                        <th className="text-left p-2">Tên</th>
                        <th className="text-left p-2">Email</th>
                        <th className="text-left p-2">Role</th>
                        <th className="text-left p-2">Điểm hiện tại</th>
                        <th className="text-left p-2">Set điểm</th>
                        <th className="text-left p-2">Cộng điểm</th>
                        <th className="text-left p-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((u) => (
                        <tr key={u.id} className="border-b">
                            <td className="p-2">{u.name}</td>
                            <td className="p-2">{u.email}</td>
                            <td className="p-2">{u.role}</td>
                            <td className="p-2 font-semibold">{u.score}</td>
                            <td className="p-2">
                                <input
                                    type="number"
                                    className="border rounded px-2 py-1 w-24"
                                    placeholder={`${u.score}`}
                                    onChange={(e) => {
                                        const value = parseInt(e.target.value || "0", 10);
                                        setUsers((prev) =>
                                            prev.map((x) =>
                                                x.id === u.id ? { ...x, setScore: value } : x
                                            )
                                        );
                                    }}
                                />
                            </td>
                            <td className="p-2">
                                <input
                                    type="number"
                                    className="border rounded px-2 py-1 w-24"
                                    placeholder="0"
                                    value={u.add ?? ""}
                                    onChange={(e) => {
                                        const value = parseInt(e.target.value || "0", 10);
                                        setUsers((prev) =>
                                            prev.map((x) =>
                                                x.id === u.id ? { ...x, add: value } : x
                                            )
                                        );
                                    }}
                                />
                            </td>
                            <td className="p-2 space-x-2">
                                <Button
                                    size="sm"
                                    disabled={loadingId === u.id}
                                    onClick={() =>
                                        handleSetScore(u.id, u.setScore ?? u.score)
                                    }
                                >
                                    {loadingId === u.id ? "Đang lưu..." : "Lưu điểm"}
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    disabled={loadingId === u.id || !u.add}
                                    onClick={() => handleAddScore(u.id, u.add ?? 0)}
                                >
                                    + Điểm
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
