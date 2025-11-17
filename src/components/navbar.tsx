"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { Avatar, AvatarImage, AvatarFallback } from "@src/components/ui/avatar";
import { Button } from "@src/components/ui/button";
import Link from "next/link";
import { useEffect } from "react";
import { useNotificationStore } from "@src/store/notification-store";

export function NavBar() {
  const { data: session, status } = useSession();
  const loading = status === "loading";

  const score = useNotificationStore((s) => s.score);

  useEffect(() => {
    console.log("NavBar session:", session);
  }, [session?.user]);

  return (
    <nav className="px-6 py-4 bg-white border-b flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Link href="/" className="text-xl font-semibold">MyApp</Link>

        {session?.user?.role === "ADMIN" && (
          <Link href="/admin" className="text-sm text-blue-600">Admin</Link>
        )}
        {session?.user && (
          <Link href="/profile" className="text-sm text-gray-700">Profile</Link>
        )}
      </div>

      {loading ? null : session?.user ? (
        <div className="flex items-center gap-4">
          <Link href="/game" className="text-sm text-blue-600">
            Game đoán số
          </Link>
          <Link href="/history">Lịch sử điểm</Link>

          <div className="flex flex-col text-right">
            <span className="text-sm font-medium">
              {session.user.name ?? "No name"}
            </span>
            <span className="text-xs text-gray-500">
              Điểm: {score ?? session.user.score}
            </span>
          </div>

          <Avatar>
            <AvatarImage src={session.user.image ?? ""} />
            <AvatarFallback>
              {session.user.name?.[0]?.toUpperCase() ?? "U"}
            </AvatarFallback>
          </Avatar>

          <Button variant="outline" size="sm" onClick={() => signOut()}>
            Logout
          </Button>
        </div>
      ) : (
        <Button size="sm" onClick={() => signIn("google")}>
          Đăng nhập
        </Button>
      )}
    </nav>
  );
}
