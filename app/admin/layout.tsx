"use client";

import type { ReactNode } from "react";
import Sidebar from "./_components/Sidebar";
import Header from "./_components/Header";
import { AdminProvider } from "@/app/context/AdminContext";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AdminProvider>
      <div className="min-h-screen bg-[#f5f6fa]">
        <div className="mx-auto flex max-w-[1400px]">
          <Sidebar />
          <div className="flex min-h-screen flex-1 flex-col">
            <Header />
            <main className="flex-1 p-6">{children}</main>
          </div>
        </div>
      </div>
    </AdminProvider>
  );
}
