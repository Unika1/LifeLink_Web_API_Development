"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { handleLogout } from "@/lib/actions/auth-actions";
import { getRequests, updateRequest } from "@/lib/api/requests";

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
        "rounded-2xl border border-white/70 bg-white/90 shadow-[0_12px_30px_rgba(31,41,55,0.12)] backdrop-blur",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}

export default function DashboardPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [requestsLoading, setRequestsLoading] = useState(true);
  const [requestsError, setRequestsError] = useState("");

  useEffect(() => {
    const loadRequests = async () => {
      try {
        setRequestsLoading(true);
        setRequestsError("");
        const userDataStr = Cookies.get("lifelink_user");
        const user = userDataStr ? JSON.parse(userDataStr) : null;

        if (!user?._id) {
          setRequestsLoading(false);
          return;
        }

        const response = await getRequests({ requestedBy: user._id });
        if (response.success) {
          setRequests(response.data || []);
        } else {
          setRequestsError(response.message || "Failed to load requests");
        }
      } catch (err: any) {
        setRequestsError(err.message || "Failed to load requests");
      } finally {
        setRequestsLoading(false);
      }
    };

    loadRequests();
  }, []);

  const handleFulfill = async (requestId: string) => {
    try {
      const response = await updateRequest(requestId, { status: "fulfilled" });
      if (response.success) {
        setRequests((prev) =>
          prev.map((item) =>
            item._id === requestId ? { ...item, status: "fulfilled" } : item
          )
        );
      }
    } catch (err: any) {
      setRequestsError(err.message || "Failed to update request");
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(1100px_circle_at_top,_#fff1f2,_#f8fafc_60%,_#e0f2fe)] text-zinc-900">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-white/70 bg-white/80 backdrop-blur">
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
                <p className="mt-1 text-2xl font-semibold">
                  {requests.filter((item) => item.status === "pending").length}
                </p>
              </div>
            </div>
          </Card>

        </div>

        <div className="mt-8">
          <Card className="p-6">
            <h2 className="text-sm font-semibold text-zinc-900">My Requests</h2>
            {requestsLoading && (
              <div className="mt-4 text-sm text-zinc-500">Loading requests...</div>
            )}
            {!requestsLoading && requestsError && (
              <div className="mt-4 text-sm text-red-600">{requestsError}</div>
            )}
            {!requestsLoading && !requestsError && requests.length === 0 && (
              <div className="mt-4 text-sm text-zinc-500">No requests yet</div>
            )}
            {!requestsLoading && !requestsError && requests.length > 0 && (
              <div className="mt-4 overflow-hidden rounded-xl border border-zinc-100">
                <table className="w-full text-sm">
                  <thead className="bg-zinc-50 text-left text-xs uppercase text-zinc-500">
                    <tr>
                      <th className="px-4 py-3 font-medium">Hospital</th>
                      <th className="px-4 py-3 font-medium">Blood</th>
                      <th className="px-4 py-3 font-medium">Units</th>
                      <th className="px-4 py-3 font-medium">Scheduled</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                      <th className="px-4 py-3 font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {requests.map((request) => (
                      <tr key={request._id}>
                        <td className="px-4 py-3 text-zinc-700">
                          {request.hospitalName || "-"}
                        </td>
                        <td className="px-4 py-3 text-zinc-700">
                          {request.bloodType}
                        </td>
                        <td className="px-4 py-3 text-zinc-700">
                          {request.unitsRequested ?? "-"}
                        </td>
                        <td className="px-4 py-3 text-zinc-700">
                          {request.scheduledAt
                            ? new Date(request.scheduledAt).toLocaleString()
                            : "-"}
                        </td>
                        <td className="px-4 py-3">
                          <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-medium text-orange-600">
                            {request.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            type="button"
                            onClick={() => handleFulfill(request._id)}
                            disabled={request.status !== "approved"}
                            className="text-xs font-semibold text-emerald-600 hover:underline disabled:opacity-40"
                          >
                            Mark fulfilled
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
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

              <Link
                href="/user/profile"
                className="flex flex-col items-center gap-3 rounded-xl p-4 hover:bg-zinc-50 transition"
              >
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
