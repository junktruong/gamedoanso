// app/history/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@src/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@src/lib/prisma";

export default async function HistoryPage() {
    const session = await getServerSession(authOptions);
    if (!session?.user) redirect("/");

    const notifications = await prisma.notification.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
    });

    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-bold">Lịch sử điểm</h1>
            {notifications.length === 0 ? (
                <p>Chưa có lịch sử điểm nào.</p>
            ) : (
                <ul className="space-y-2">
                    {notifications.map((n: any) => (
                        <li
                            key={n.id}
                            className="border rounded px-3 py-2 bg-white flex justify-between"
                        >
                            <span className="text-sm">{n.message}</span>
                            <span className="text-xs text-gray-500">
                                {new Date(n.createdAt).toLocaleString()}
                            </span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
