
"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { handleLogout } from "@/lib/actions/auth-actions";
import { getRequests, updateRequest, deleteRequest } from "@/lib/api/requests";
import { getOrganRequests, deleteOrganRequest } from "@/lib/api/organ-requests";

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
  const router = useRouter();
  const pathname = usePathname();
  const [requests, setRequests] = useState<any[]>([]);
  const [requestsLoading, setRequestsLoading] = useState(true);
  const [requestsError, setRequestsError] = useState("");
  const [userName, setUserName] = useState("Donor");
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [showLocationPrompt, setShowLocationPrompt] = useState(false);
  const [showRequestMenu, setShowRequestMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [seenNotificationIds, setSeenNotificationIds] = useState<string[]>([]);
  // Show location permission modal if location is not set and user clicks hospital/blood bank
  const handleEnableLocation = () => {
    setShowLocationPrompt(true);
  };
  const [locationName, setLocationName] = useState<string>("");
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState("");

  const loadRequests = async () => {
    try {
      setRequestsLoading(true);
      setRequestsError("");
      const userDataStr = Cookies.get("lifelink_user");
      const user = userDataStr ? JSON.parse(userDataStr) : null;

      if (!user?._id) {
        setRequests([]);
        return;
      }

      if (user?.firstName) {
        setUserName(user.firstName);
      }

      const [bloodResponse, organResponse] = await Promise.all([
        getRequests({ requestedBy: user._id }),
        getOrganRequests({ requestedBy: user._id }),
      ]);

      if (!bloodResponse.success && !organResponse.success) {
        setRequestsError(
          bloodResponse.message || organResponse.message || "Failed to load requests"
        );
        setRequests([]);
        return;
      }

      const bloodRequests = (bloodResponse.data || []).map((item: any) => ({
        ...item,
        requestType: "blood",
        status: item.status || "pending",
      }));

      const organRequests = (organResponse.data || []).map((item: any) => ({
        ...item,
        requestType: "organ",
        bloodType: "Organ",
        unitsRequested: null,
        status: item.status || "pending",
      }));

      setRequests([...bloodRequests, ...organRequests]);
    } catch (err: any) {
      setRequestsError(err.message || "Failed to load requests");
    } finally {
      setRequestsLoading(false);
    }
  };

  // Handles click on the Nearby Hospital card
  const handleNearbyHospitalClick = async () => {
    setLocationError("");
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported in this browser.");
      return;
    }
    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setLocation({ lat, lng });
        // Reverse geocoding to get location name
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
          );
          const data = await response.json();
          const locationName =
            data.address?.city ||
            data.address?.town ||
            data.address?.county ||
            data.address?.state ||
            `Lat ${lat.toFixed(4)}, Lng ${lng.toFixed(4)}`;
          setLocationName(locationName);
        } catch (err) {
          setLocationName(`Lat ${lat.toFixed(4)}, Lng ${lng.toFixed(4)}`);
        }
        setLocationLoading(false);
        // Open Google Maps with hospitals near the user
        window.open(
          `https://www.google.com/maps/search/hospitals/@${lat},${lng},14z`,
          '_blank'
        );
      },
      (error) => {
        setLocationError(error.message || "Failed to get location.");
        setLocationLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  useEffect(() => {
    const savedValue = window.localStorage.getItem("lifelink_seen_notification_ids");
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

    loadRequests();

    const intervalId = window.setInterval(() => {
      loadRequests();
    }, 10000);

    const handleWindowFocus = () => {
      loadRequests();
    };

    window.addEventListener("focus", handleWindowFocus);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener("focus", handleWindowFocus);
    };
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

  const handleDelete = async (requestId: string) => {
    if (!confirm("Are you sure you want to delete this request?")) {
      return;
    }

    try {
      await deleteRequest(requestId);
      setRequests((prev) => prev.filter((item) => item._id !== requestId));
    } catch (err: any) {
      setRequestsError(err.message || "Failed to delete request");
    }
  };

  const handleDeleteOrgan = async (requestId: string) => {
    try {
      await deleteOrganRequest(requestId);
      setRequests((prev) => prev.filter((item) => item._id !== requestId));
    } catch (err: any) {
      setRequestsError(err.message || "Failed to delete request");
    }
  };

  const requestLocation = () => {
    setLocationError("");

    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported in this browser.");
      setShowLocationPrompt(false);
      return;
    }

    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setLocation({ lat, lng });

        // Reverse geocoding to get location name
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
          );
          const data = await response.json();
          const locationName =
            data.address?.city ||
            data.address?.town ||
            data.address?.county ||
            data.address?.state ||
            `Lat ${lat.toFixed(4)}, Lng ${lng.toFixed(4)}`;
          setLocationName(locationName);
        } catch (err) {
          setLocationName(`Lat ${lat.toFixed(4)}, Lng ${lng.toFixed(4)}`);
        }
        setLocationLoading(false);
        setShowLocationPrompt(false);
      },
      (error) => {
        setLocationError(error.message || "Failed to get location.");
        setLocationLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const totalRequests = requests.length;

  const getStatusClass = (status: string) => {
    if (status === "approved") return "bg-emerald-50 text-emerald-600";
    if (status === "rejected") return "bg-red-50 text-red-600";
    if (status === "fulfilled") return "bg-indigo-50 text-indigo-600";
    return "bg-amber-50 text-amber-600";
  };

  const getRequestDate = (request: any) =>
    request.scheduledAt || request.updatedAt || request.createdAt || null;

  const formatDate = (value: string | null) =>
    value ? new Date(value).toLocaleString() : "Not scheduled";

  const sortedRequests = [...requests].sort((a, b) => {
    const dateA = getRequestDate(a) ? new Date(getRequestDate(a)).getTime() : 0;
    const dateB = getRequestDate(b) ? new Date(getRequestDate(b)).getTime() : 0;
    return dateB - dateA;
  });

  const recentRequests = sortedRequests.slice(0, 5);

  const normalizeStatus = (status?: string) => {
    const lowerStatus = (status || "pending").toLowerCase();
    return lowerStatus === "accepted" ? "approved" : lowerStatus;
  };

  const isHospitalDecisionStatus = (status?: string) => {
    const normalized = normalizeStatus(status);
    return normalized === "approved" || normalized === "rejected" || normalized === "fulfilled";
  };

  const notifications = sortedRequests
    .filter((request) => isHospitalDecisionStatus(request.status))
    .slice(0, 8)
    .map((request) => {
    const rawDate = getRequestDate(request);
    const timestamp = rawDate ? new Date(rawDate).getTime() : 0;
    const normalizedStatus = normalizeStatus(request.status);
    const eventKey = `${request.requestType || "blood"}-${request._id || "unknown"}-${normalizedStatus}-${rawDate || "no-date"}`;

    return {
      id: eventKey,
      timestamp,
      dateLabel: formatDate(rawDate),
      title: request.requestType === "organ" ? "Organ request update" : "Blood request update",
      subtitle: `${request.hospitalName || "Unknown hospital"} • ${normalizedStatus}`,
      status: normalizedStatus,
    };
  });

  const unreadCount = notifications.filter(
    (item) => !seenNotificationIds.includes(item.id)
  ).length;

  const markNotificationsAsRead = () => {
    const nextSeenIds = Array.from(new Set([...seenNotificationIds, ...notifications.map((item) => item.id)]));
    setSeenNotificationIds(nextSeenIds);
    window.localStorage.setItem("lifelink_seen_notification_ids", JSON.stringify(nextSeenIds));
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(1100px_circle_at_top,#fff1f2,#f8fafc_60%,#e0f2fe)] text-zinc-900">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-white/70 bg-white/80 backdrop-blur">
        <div className="mx-auto max-w-6xl px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-6">
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

              <nav className="flex max-w-[60vw] items-center gap-2 overflow-x-auto">
                <Link
                  href="/dashboard"
                  className={[
                    "rounded-lg px-3 py-2 text-sm font-medium whitespace-nowrap",
                    pathname === "/dashboard"
                      ? "bg-zinc-100 font-semibold text-zinc-900"
                      : "text-zinc-700 hover:bg-zinc-100",
                  ].join(" ")}
                >
                  Home
                </Link>
                <Link
                  href="/request/select"
                  className={[
                    "rounded-lg px-3 py-2 text-sm font-medium whitespace-nowrap",
                    pathname?.startsWith("/request")
                      ? "bg-zinc-100 font-semibold text-zinc-900"
                      : "text-zinc-700 hover:bg-zinc-100",
                  ].join(" ")}
                >
                  Request
                </Link>
                <Link
                  href="/user/profile"
                  className={[
                    "rounded-lg px-3 py-2 text-sm font-medium whitespace-nowrap",
                    pathname === "/user/profile"
                      ? "bg-zinc-100 font-semibold text-zinc-900"
                      : "text-zinc-700 hover:bg-zinc-100",
                  ].join(" ")}
                >
                  Profile
                </Link>
              </nav>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative">
                <button
                  type="button"
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
                  aria-label="Notifications"
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
                    <span className="absolute -right-1 -top-1 min-w-5 rounded-full bg-red-500 px-1.5 text-center text-[10px] font-semibold text-white">
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
                      {notifications.length === 0 ? (
                        <p className="px-4 py-6 text-sm text-zinc-500">No notifications yet.</p>
                      ) : (
                        notifications.map((item) => (
                          <div key={item.id} className="border-b border-zinc-100 px-4 py-3 last:border-b-0">
                            <p className="text-sm font-medium text-zinc-900">{item.title}</p>
                            <p className="mt-0.5 text-xs text-zinc-600">{item.subtitle}</p>
                            <p className="mt-1 text-[11px] text-zinc-500">{item.dateLabel}</p>
                          </div>
                        ))
                      )}
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
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-6xl px-6 py-8">
        <div>
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#d4002a]">
              Donor Dashboard
            </p>
            <h1 className="mt-2 text-2xl font-semibold text-zinc-900">
              Welcome back, {userName}
            </h1>
            <p className="mt-1 text-sm text-zinc-500">
              Track your requests and donation status.
            </p>
          </div>
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowRequestMenu((prev) => !prev)}
              className="rounded-lg bg-[#d4002a] px-4 py-2 text-sm font-semibold text-white hover:bg-[#b8002a]"
            >
              + New Request
            </button>
            {showRequestMenu && (
              <div className="absolute right-0 z-20 mt-2 w-48 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-lg">
                <button
                  type="button"
                  onClick={() => {
                    setShowRequestMenu(false);
                    router.push("/eligibility?type=blood");
                  }}
                  className="w-full px-4 py-3 text-left text-sm text-zinc-700 hover:bg-zinc-50"
                >
                  Blood Donation
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowRequestMenu(false);
                    router.push("/eligibility?type=organ");
                  }}
                  className="w-full px-4 py-3 text-left text-sm text-zinc-700 hover:bg-zinc-50"
                >
                  Organ Donation
                </button>
              </div>
            )}
          </div>
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

        {/* Nearby Hospital & Blood Bank Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 mb-8">
          {/* Nearby Hospital Card */}
          <div
            className="cursor-pointer rounded-2xl border border-white/70 bg-white/90 shadow-[0_12px_30px_rgba(31,41,55,0.12)] backdrop-blur hover:shadow-lg transition"
            onClick={() => {
              if (location) {
                window.open(`https://www.google.com/maps/search/hospitals/@${location.lat},${location.lng},14z`, '_blank');
              } else {
                handleEnableLocation();
              }
            }}
          >
            <div className="flex flex-col items-center justify-center gap-4 p-8">
              <div className="h-16 w-16 rounded-2xl bg-[#ffe1e6] flex items-center justify-center">
                <Image
                  src="/blood-drop.png"
                  alt="Nearby hospital"
                  width={40}
                  height={40}
                  className="h-10 w-10 object-contain"
                />
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold text-zinc-700">
                  Nearby Hospital
                </p>
                <p className="mt-1 text-sm text-zinc-500">
                  {location ? "Hospitals near you" : "Find hospitals nearby"}
                </p>
                {location && locationName && (
                  <div className="mt-3 text-xs text-zinc-500">
                    <p>📍 {locationName}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* Nearby Blood Bank Card */}
          <div
            className="cursor-pointer rounded-2xl border border-white/70 bg-white/90 shadow-[0_12px_30px_rgba(31,41,55,0.12)] backdrop-blur hover:shadow-lg transition"
            onClick={() => {
              if (location) {
                window.open(`https://www.google.com/maps/search/blood+bank/@${location.lat},${location.lng},14z`, '_blank');
              } else {
                handleEnableLocation();
              }
            }}
          >
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
                  Blood Banks
                </p>
                <p className="mt-1 text-sm text-zinc-500">
                  {location ? "Blood banks near you" : "Check availability"}
                </p>
              </div>
            </div>
          </div>
        </div>
      
        <div className="mt-8">
          <Card className="p-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-sm font-semibold text-zinc-900">My Requests</h2>
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-600">
                  Total {totalRequests}
                </span>
                <Link href="/request" className="text-xs font-semibold text-[#d4002a] hover:underline">
                  View all
                </Link>
              </div>
            </div>
            {requestsLoading && (
              <div className="mt-4 text-sm text-zinc-500">Loading requests...</div>
            )}
            {!requestsLoading && requestsError && (
              <div className="mt-4 text-sm text-red-600">{requestsError}</div>
            )}
            {!requestsLoading && !requestsError && requests.length === 0 && (
              <div className="mt-4 text-sm text-zinc-500">No requests yet</div>
            )}
            {!requestsLoading && !requestsError && recentRequests.length > 0 && (
              <div className="mt-4 overflow-hidden rounded-xl border border-zinc-100">
                <table className="w-full text-sm">
                  <thead className="bg-zinc-50 text-left text-xs uppercase text-zinc-500">
                    <tr>
                      <th className="px-4 py-3 font-medium">Hospital</th>
                      <th className="px-4 py-3 font-medium">Blood</th>
                      <th className="px-4 py-3 font-medium">Units</th>
                      <th className="px-4 py-3 font-medium">Date & Time</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                      <th className="px-4 py-3 font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {recentRequests.map((request) => (
                      <tr key={request._id}>
                        <td className="px-4 py-3 text-zinc-700">
                          {request.hospitalName || "-"}
                        </td>
                        <td className="px-4 py-3 text-zinc-700">
                          {request.requestType === "organ" ? "Organ" : request.bloodType}
                        </td>
                        <td className="px-4 py-3 text-zinc-700">
                          {request.requestType === "organ" ? "-" : request.unitsRequested ?? "-"}
                        </td>
                        <td className="px-4 py-3 text-zinc-700">
                          {formatDate(getRequestDate(request))}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusClass(
                              request.status || "pending"
                            )}`}
                          >
                            {request.status || "pending"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2 flex-wrap">
                            {request.requestType !== "organ" && (
                              <>
                                <Link
                                  href={`/request/${request._id}`}
                                  className="text-xs font-semibold text-indigo-600 hover:underline"
                                >
                                  View
                                </Link>
                                <Link
                                  href={`/request?edit=${request._id}`}
                                  className="text-xs font-semibold text-blue-600 hover:underline"
                                >
                                  Edit
                                </Link>
                                <button
                                  type="button"
                                  onClick={() => handleDelete(request._id)}
                                  className="text-xs font-semibold text-red-600 hover:underline"
                                >
                                  Delete
                                </button>
                              </>
                            )}
                            {request.requestType === "organ" && (
                              <>
                                <Link
                                  href={`/request/organ?view=${request._id}`}
                                  className="text-xs font-semibold text-indigo-600 hover:underline"
                                >
                                  View
                                </Link>
                                <Link
                                  href={`/request/organ?edit=${request._id}`}
                                  className="text-xs font-semibold text-blue-600 hover:underline"
                                >
                                  Edit
                                </Link>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteOrgan(request._id)}
                                  className="text-xs font-semibold text-red-600 hover:underline"
                                >
                                  Delete
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>

        </div>

        {/* Location Permission Modal */}
        {showLocationPrompt && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <Card className="max-w-sm w-full">
              <div className="p-6 space-y-4">
                <div className="text-center">
                  <p className="text-2xl mb-2">📍</p>
                  <h3 className="text-lg font-semibold text-zinc-900">Allow Location Access?</h3>
                  <p className="mt-2 text-sm text-zinc-500">
                    We need your permission to access your location and show nearby hospitals and blood banks.
                  </p>
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowLocationPrompt(false)}
                    className="flex-1 rounded-lg border border-zinc-300 px-4 py-2 font-medium text-zinc-700 hover:bg-zinc-50 transition"
                  >
                    Not Now
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      requestLocation();
                    }}
                    disabled={locationLoading}
                    className="flex-1 rounded-lg bg-[#d4002a] px-4 py-2 font-medium text-white hover:bg-[#b8002a] disabled:opacity-60 transition"
                  >
                    {locationLoading ? "Getting..." : "Enable Location"}
                  </button>
                </div>
                {locationError && (
                  <p className="text-xs text-red-600 text-center">{locationError}</p>
                )}
              </div>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
