import { NextResponse } from "next/server";
import { prisma } from "@src/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@src/lib/auth";

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { amount } = await req.json();

    if (!amount || typeof amount !== "number" || amount <= 0) {
        return NextResponse.json({ error: "Invalid bet amount" }, { status: 400 });
    }

    const userId = session.user.id;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.score < amount) {
        return NextResponse.json(
            { error: "Không đủ điểm để cược", code: "NOT_ENOUGH_SCORE" },
            { status: 400 }
        );
    }

    const updated = await prisma.user.update({
        where: { id: userId },
        data: { score: { decrement: amount } },
    });

    return NextResponse.json({
        ok: true,
        newScore: updated.score,
        betAmount: amount,
    });
}
