// app/admin/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@src/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@src/lib/prisma";
import AdminClient from "./admin-client";

export default async function AdminPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "ADMIN") {
        redirect("/");
    }

    const users = await prisma.user.findMany({
        orderBy: { createdAt: "desc" },
    });

    // Chuyển sang client component để edit
    return <AdminClient initialUsers={users} />;
}
