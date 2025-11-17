// app/api/admin/users/set/route.ts
import { prisma } from "@src/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@src/lib/auth";

export async function PATCH(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "ADMIN") {
        return new NextResponse("Forbidden", { status: 403 });
    }

    const { id, score } = await req.json();

    if (!id || typeof score !== "number") {
        return new NextResponse("Bad Request", { status: 400 });
    }

    const updated = await prisma.user.update({
        where: { id },
        data: { score },
    });

    return NextResponse.json(updated);
}
