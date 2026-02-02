"use client";

import { handleLogout } from "@/lib/actions/auth-actions";

export default function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-zinc-200 bg-white">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <h1 className="text-lg font-semibold text-zinc-900">
            Hospital Admin
          </h1>
          <p className="text-xs text-zinc-500">Manage blood requests, donors, inventory & staff</p>
        </div>

        <div className="flex items-center gap-3">
          <button className="relative rounded-xl px-3 py-2 hover:bg-zinc-50">
            🔔
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
          </button>

          <div className="flex items-center gap-2 rounded-2xl border border-zinc-200 px-3 py-2">
            <div className="h-8 w-8 rounded-full bg-zinc-200" />
            <div className="leading-tight">
              <p className="text-sm font-semibold text-zinc-900">Admin</p>
              <p className="text-xs text-zinc-500">admin@lifelink.com</p>
            </div>
          </div>

          <form action={handleLogout}>
            <button
              type="submit"
              className="rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-100"
            >
              Logout
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
