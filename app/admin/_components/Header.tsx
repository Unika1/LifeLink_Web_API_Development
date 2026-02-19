"use client";

import { useEffect, useMemo, useState } from "react";
import { handleLogout } from "@/lib/actions/auth-actions";
import { getRequests } from "@/lib/api/requests";
import { getOrganRequests } from "@/lib/api/organ-requests";
import { useAdminSearch } from "../context/AdminContext";

type NotificationItem = {
  id: string;
  timestamp: number;
  title: string;
  subtitle: string;
  timeLabel: string;
};

export default function Header() {
  const { searchQuery, setSearchQuery } = useAdminSearch();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [notificationError, setNotificationError] = useState("");
  const [seenNotificationIds, setSeenNotificationIds] = useState<string[]>([]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    const savedValue = window.localStorage.getItem("lifelink_admin_seen_notification_ids");
    if (savedValue) {
      try {
        const parsedValue = JSON.parse(savedValue);
        if (Array.isArray(parsedValue)) {
          setSeenNotificationIds(parsedValue.filter((value) => typeof value === "string"));
        }
      } catch {
        setSeenNotificationIds([]);
      }
    }
  }, []);

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        setNotificationError("");
        const [bloodResponse, organResponse] = await Promise.all([
          getRequests(),
          getOrganRequests(),
        ]);

        const bloodItems = (bloodResponse?.data || []).map((item: any) => {
          const rawDate = item.scheduledAt || item.updatedAt || item.createdAt;
          const timestamp = rawDate ? new Date(rawDate).getTime() : 0;
          return {
            id: `blood-${item._id}`,
            timestamp,
            title: "Blood request update",
            subtitle: `${item.hospitalName || "Unknown hospital"} • ${item.status || "pending"}`,
            timeLabel: rawDate ? new Date(rawDate).toLocaleString() : "No date",
          };
        });

        const organItems = (organResponse?.data || []).map((item: any) => {
          const rawDate = item.scheduledAt || item.updatedAt || item.createdAt;
          const timestamp = rawDate ? new Date(rawDate).getTime() : 0;
          return {
            id: `organ-${item._id}`,
            timestamp,
            title: "Organ request update",
            subtitle: `${item.hospitalName || "Unknown hospital"} • ${item.status || "pending"}`,
            timeLabel: rawDate ? new Date(rawDate).toLocaleString() : "No date",
          };
        });

        const merged = [...bloodItems, ...organItems].sort(
          (a, b) => b.timestamp - a.timestamp
        );

        setNotifications(merged.slice(0, 10));
      } catch (error: any) {
        setNotificationError(error.message || "Failed to load notifications");
      }
    };

    loadNotifications();
    const intervalId = window.setInterval(loadNotifications, 15000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  const unreadCount = useMemo(
    () => notifications.filter((item) => !seenNotificationIds.includes(item.id)).length,
    [notifications, seenNotificationIds]
  );

  const markNotificationsAsRead = () => {
    const nextSeenIds = Array.from(
      new Set([...seenNotificationIds, ...notifications.map((item) => item.id)])
    );
    setSeenNotificationIds(nextSeenIds);
    window.localStorage.setItem(
      "lifelink_admin_seen_notification_ids",
      JSON.stringify(nextSeenIds)
    );
  };

  return (
    <header className="sticky top-0 z-30 border-b border-zinc-200 bg-white">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-6">
          <div>
            <h1 className="text-lg font-semibold text-zinc-900"> Admin</h1>
            <p className="text-xs text-zinc-500">
              Manage hospital requests, donors, inventory & staff
            </p>
          </div>

          <div className="hidden items-center md:flex">
            <div className="flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-2">
              <span className="text-xs text-zinc-400">🔍</span>
              <input
                type="search"
                placeholder="Search users, hospitals, blood types..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-48 bg-transparent text-sm text-zinc-700 placeholder:text-zinc-400 focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              type="button"
              aria-label="Notifications"
              onClick={() => {
                setShowNotifications((prev) => {
                  const next = !prev;
                  if (next) {
                    markNotificationsAsRead();
                  }
                  return next;
                });
              }}
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-600 shadow-sm transition hover:-translate-y-0.5 hover:border-zinc-300 hover:bg-zinc-50 hover:text-zinc-800"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-5 w-5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 1 0-12 0v3.2a2 2 0 0 1-.6 1.4L4 17h5" />
                <path d="M9 17a3 3 0 0 0 6 0" />
              </svg>
              {unreadCount > 0 && (
                <span className="absolute -right-1 -top-1 min-w-5 rounded-full bg-[#d4002a] px-1.5 text-center text-[10px] font-semibold text-white shadow-sm">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 z-30 mt-2 w-80 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-lg">
                <div className="flex items-center justify-between border-b border-zinc-100 px-4 py-3">
                  <p className="text-sm font-semibold text-zinc-900">Notifications</p>
                  <button
                    type="button"
                    className="text-xs font-medium text-zinc-500 hover:text-zinc-700"
                    onClick={() => setShowNotifications(false)}
                  >
                    Close
                  </button>
                </div>

                <div className="max-h-80 overflow-y-auto">
                  {notificationError && (
                    <p className="px-4 py-4 text-sm text-red-600">{notificationError}</p>
                  )}
                  {!notificationError && notifications.length === 0 && (
                    <p className="px-4 py-6 text-sm text-zinc-500">No notifications yet.</p>
                  )}
                  {!notificationError &&
                    notifications.map((item) => (
                      <div key={item.id} className="border-b border-zinc-100 px-4 py-3 last:border-b-0">
                        <p className="text-sm font-medium text-zinc-900">{item.title}</p>
                        <p className="mt-0.5 text-xs text-zinc-600">{item.subtitle}</p>
                        <p className="mt-1 text-[11px] text-zinc-500">{item.timeLabel}</p>
                      </div>
                    ))}
                </div>
              </div>
            )}
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
