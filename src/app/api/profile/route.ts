// app/api/profile/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@src/lib/auth";
import { prisma } from "@src/lib/prisma";

export async function PATCH(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const { name, image } = await req.json();

    const updated = await prisma.user.update({
        where: { id: session.user.id },
        data: {
            name,
            image,
        },
    });

    return NextResponse.json(updated);
}
