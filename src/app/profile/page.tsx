// app/profile/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@src/lib/auth";
import { redirect } from "next/navigation";
import ProfileClient from "./profile-client";
import { prisma } from "@src/lib/prisma";

export default async function ProfilePage() {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        redirect("/");
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
    });

    if (!user) {
        redirect("/");
    }

    return <ProfileClient user={user} />;
}
