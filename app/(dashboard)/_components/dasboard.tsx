"use client";

import Link from "next/link";
import Image from "next/image";
import { handleLogout } from "@/lib/actions/auth-actions";

function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={[
        "rounded-2xl border border-zinc-200 bg-white shadow-[0_8px_24px_rgba(0,0,0,0.06)]",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[#fbf7f7] text-zinc-900">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-zinc-200 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 overflow-hidden rounded-xl bg-[#ffd7dd] flex items-center justify-center">
                <div className="relative h-28 w-full">
                  <Image
                    src="/lifelink.png"
                    alt="Logo"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </div>
              <div className="leading-tight">
                <p className="text-base font-semibold tracking-tight">
                  LifeLink
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                type="button"
                className="relative rounded-xl px-3 py-2 hover:bg-zinc-50"
                aria-label="Notifications"
              >
                <span className="text-2xl">🔔</span>
                <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-red-500" />
              </button>
              
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
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-6xl px-6 py-8">
        {/* Location */}
        <div className="mb-6 flex items-center gap-2 text-[#7b2b33]">
          <span className="text-xl">📍</span>
          <p className="text-base font-semibold">Maitidevi</p>
        </div>

        {/* Banner Image */}
        <Card className="mb-8 overflow-hidden">
          <div className="relative h-64 w-full md:h-80">
            <Image
              src="/banner.png"
              alt="Donation banner"
              fill
              className="object-cover"
              priority
            />
          </div>
        </Card>

        {/* Nearby Hospital Big Card */}
        <Link href="/hospitals" className="block mb-6">
          <Card className="hover:shadow-lg transition">
            <div className="flex items-center gap-6 p-6">
              <div className="h-16 w-16 rounded-2xl bg-[#ffe1e6] flex items-center justify-center flex-shrink-0">
                <Image
                  src="/blood-drop.png"
                  alt="Nearby hospital"
                  width={40}
                  height={40}
                  className="h-10 w-10 object-contain"
                />
              </div>
              <div className="flex-1">
                <p className="text-xl font-semibold text-zinc-800">
                  Nearby hospital
                </p>
                <p className="mt-2 text-sm text-zinc-500">
                  Find hospitals around your location
                </p>
              </div>
              <span className="text-3xl text-zinc-400">›</span>
            </div>
          </Card>
        </Link>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 mb-8">
          <Link href="/blood-banks" className="block">
            <Card className="h-full hover:shadow-lg transition">
              <div className="flex flex-col items-center justify-center gap-4 p-8">
                <div className="h-16 w-16 rounded-2xl bg-[#fff1f3] flex items-center justify-center">
                  <Image
                    src="/blood-transfusion.png"
                    alt="Blood banks"
                    width={40}
                    height={40}
                    className="h-10 w-10 object-contain"
                  />
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold text-zinc-700">
                    Blood banks
                  </p>
                  <p className="mt-1 text-sm text-zinc-500">
                    Check availability
                  </p>
                </div>
              </div>
            </Card>
          </Link>

          <Link href="/hospitals" className="block">
            <Card className="h-full hover:shadow-lg transition">
              <div className="flex flex-col items-center justify-center gap-4 p-8">
                <div className="h-16 w-16 rounded-2xl bg-[#fff1f3] flex items-center justify-center">
                  <Image
                    src="/hospital.png"
                    alt="Hospital"
                    width={40}
                    height={40}
                    className="h-10 w-10 object-contain"
                  />
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold text-zinc-700">Hospital</p>
                  <p className="mt-1 text-sm text-zinc-500">
                    View hospitals
                  </p>
                </div>
              </div>
            </Card>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center text-2xl">
                💉
              </div>
              <div>
                <p className="text-sm text-zinc-500">Blood Donations</p>
                <p className="mt-1 text-2xl font-semibold">12</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-green-50 flex items-center justify-center text-2xl">
                📋
              </div>
              <div>
                <p className="text-sm text-zinc-500">Active Requests</p>
                <p className="mt-1 text-2xl font-semibold">3</p>
              </div>
            </div>
          </Card>

        </div>

        {/* Bottom Navigation Links */}
        <div className="mt-12">
          <Card className="p-4">
            <div className="grid grid-cols-3 gap-6">
              <Link href="/dashboard" className="flex flex-col items-center gap-3 rounded-xl p-4 hover:bg-zinc-50 transition">
                <span className="text-3xl">🏠</span>
                <span className="text-sm font-semibold text-zinc-900">Home</span>
              </Link>

              <Link href="/request" className="flex flex-col items-center gap-3 rounded-xl p-4 hover:bg-zinc-50 transition">
                <span className="text-3xl">🧾</span>
                <span className="text-sm font-semibold text-zinc-900">Request</span>
              </Link>

              <Link href="/user/profile" className="flex flex-col items-center gap-3 rounded-xl p-4 hover:bg-zinc-50 transition">
                <span className="text-3xl">👤</span>
                <span className="text-sm font-semibold text-zinc-900">Profile</span>
              </Link>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
