// src/app/game/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@src/lib/auth";
import { redirect } from "next/navigation";
import GameClient from "./game-client";

export default async function GamePage() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        redirect("/api/auth/signin");
    }

    return (
        <div className="flex justify-center mt-8">
            <GameClient userId={session.user.id} />
        </div>
    );
}
