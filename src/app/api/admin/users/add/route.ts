export const runtime = "nodejs";

import { prisma } from "@src/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@src/lib/auth";
// import { getServerWs } from "@src/lib/ws-server-client";

export async function PATCH(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "ADMIN") {
        return new NextResponse("Forbidden", { status: 403 });
    }

    const { id, amount } = await req.json();
    if (!id || typeof amount !== "number")
        return new NextResponse("Bad Request", { status: 400 });

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return new NextResponse("User not found", { status: 404 });

    const newScore = user.score + amount;

    const updated = await prisma.user.update({
        where: { id },
        data: { score: newScore },
    });

    const message = `Bạn vừa được cộng +${amount} điểm!`;

    await prisma.notification.create({
        data: {
            userId: id,
            message,
        },
    });

    // === 🔥 GỬI BẰNG WEBSOCKET SERVER-SIDE ===
    // try {
    //     const ws = getServerWs();

    //     if (ws && ws.readyState === 1) {
    //         ws.send(JSON.stringify({
    //             type: "notify",
    //             userId: id,
    //             message,
    //             newScore,
    //         }));

    //         console.log("WS sent:", id, message);
    //     } else {
    //         console.error("WS not ready:", ws?.readyState);
    //     }

    // } catch (err) {
    //     console.error("WS send error:", err);
    // }

    await fetch(process.env.WS_NOTIFY_URL!, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            userId: id,
            message,
            newScore
        })
    });

    return NextResponse.json(updated);
}
