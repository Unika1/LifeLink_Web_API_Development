
"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { handleLogout } from "@/lib/actions/auth-actions";
import { getRequests, updateRequest, deleteRequest } from "@/lib/api/requests";

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
  const [userName, setUserName] = useState("Donor");
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [showLocationPrompt, setShowLocationPrompt] = useState(false);
  // Show location permission modal if location is not set and user clicks hospital/blood bank
  const handleEnableLocation = () => {
    setShowLocationPrompt(true);
  };
  const [locationName, setLocationName] = useState<string>("");
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState("");

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

        if (user?.firstName) {
          setUserName(user.firstName);
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


                {/* Inline Map for Nearby Blood Banks */}
                <div className="mt-8 rounded-xl overflow-hidden border border-zinc-200">
                  {/* Only show map if user location is available */}
                  {location ? (
                    <iframe
                      title="Nearby Blood Banks Map"
                      width="100%"
                      height="400"
                      style={{ border: 0 }}
                      src={`https://www.openstreetmap.org/export/embed.html?bbox=${location.lng-0.05}%2C${location.lat-0.05}%2C${location.lng+0.05}%2C${location.lat+0.05}&layer=mapnik&marker=${location.lat}%2C${location.lng}`}
                      allowFullScreen
                    />
                  ) : (
                    <div className="p-4 text-zinc-500">Location not available. Enable location to see blood banks near you.</div>
                  )}
                </div>
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

  const locationLabel = locationName || "Location not set";

  const mapsUrl = location
    ? `https://www.google.com/maps/search/hospitals/@${location.lat},${location.lng},14z`
    : "https://www.google.com/maps/search/hospitals";

  return (
    <div className="min-h-screen bg-[radial-gradient(1100px_circle_at_top,#fff1f2,#f8fafc_60%,#e0f2fe)] text-zinc-900">
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
          <Link
            href="/request"
            className="rounded-lg bg-[#d4002a] px-4 py-2 text-sm font-semibold text-white hover:bg-[#b8002a]"
          >
            + New Request
          </Link>
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
                  Total {requests.length}
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
                      <th className="px-4 py-3 font-medium">Scheduled</th>
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
                          {request.bloodType}
                        </td>
                        <td className="px-4 py-3 text-zinc-700">
                          {request.unitsRequested ?? "-"}
                        </td>
                        <td className="px-4 py-3 text-zinc-700">
                          {request.scheduledAt ? formatDate(request.scheduledAt) : "-"}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusClass(
                              request.status
                            )}`}
                          >
                            {request.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Link
                              href={`/request/${request._id}`}
                              className="text-xs font-semibold text-indigo-600 hover:underline"
                            >
                              👁️ View
                            </Link>
                            <Link
                              href={`/request?edit=${request._id}`}
                              className="text-xs font-semibold text-blue-600 hover:underline"
                            >
                              ✏️ Edit
                            </Link>
                            <button
                              type="button"
                              onClick={() => handleDelete(request._id)}
                              className="text-xs font-semibold text-red-600 hover:underline"
                            >
                              🗑️ Delete
                            </button>
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
