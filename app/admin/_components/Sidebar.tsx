"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Overview", href: "/admin" },
  { label: "Blood Requests", href: "/admin/requests" },
  { label: "Donors", href: "/admin/users" },
  { label: "Blood Inventory", href: "/admin/inventory" },
  { label: "Staff", href: "/admin/staff" },
  { label: "Profile", href: "/admin/profile" },
  { label: "Settings", href: "/admin/settings" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden h-screen w-[260px] border-r border-zinc-200 bg-white p-5 md:block">
      <div className="flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#ffd7dd]">
          🩸
        </div>
        <div>
          <p className="text-sm font-semibold text-zinc-900">LifeLink Admin</p>
          <p className="text-xs text-zinc-500">Hospital Dashboard</p>
        </div>
      </div>

      <nav className="mt-8 space-y-1">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={[
                "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition",
                active
                  ? "bg-[#ffe9ec] text-[#d4002a]"
                  : "text-zinc-700 hover:bg-zinc-50",
              ].join(" ")}
            >
              <span className="text-lg">•</span>
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
