import { NextResponse } from "next/server";
import { prisma } from "@src/lib/prisma";

export async function POST(req: Request) {
    const { userId, amount } = await req.json();

    if (!userId || !amount || typeof amount !== "number" || amount <= 0) {
        return NextResponse.json({ error: "Bad request" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const updated = await prisma.user.update({
        where: { id: userId },
        data: { score: { increment: amount } },
    });

    // (tuỳ chọn) notify thêm cho client biết là vừa được + điểm
    // nếu bạn muốn dùng API /notify:
    await fetch(process.env.WS_NOTIFY_URL!, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            userId,
            message: `Bạn vừa thắng +${amount} điểm ở bàn Tài Xỉu!`,
            newScore: updated.score,
        }),
    });

    return NextResponse.json({
        ok: true,
        newScore: updated.score,
    });
}
