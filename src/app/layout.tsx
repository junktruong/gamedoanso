// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import { Providers } from "@src/components/providers";
import { NavBar } from "@src/components/navbar";
import { Toaster } from "@src/components/ui/toaster";

import UserScoreListener from "@src/components/user-score-listener";
import { ToastProvider } from "@src/components/ui/toast-provider";

export const metadata: Metadata = {
  title: "MyApp",
  description: "Next.js + Prisma + Mongo + NextAuth + shadcn",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <html lang="en" className="mdl-js">
      <body className="bg-slate-50 min-h-screen">
        <ToastProvider>
          <Providers>

            <NavBar />

            <UserScoreListener />
            <main className="max-w-5xl mx-auto mt-6 px-4">{children}</main>
            <Toaster />

          </Providers>
        </ToastProvider>
      </body>
    </html>
  );
}
