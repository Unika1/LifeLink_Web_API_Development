"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import SectionHeader from "@/app/_components/SectionHeader";
import { handleLogout } from "@/lib/actions/auth-actions";
import {
  getHospitals,
  getDonors,
} from "@/lib/api/hospital";
import { getRequests, updateRequest } from "@/lib/api/requests";
import { getOrganRequests, updateOrganRequest } from "@/lib/api/organ-requests";
import { getLatestEligibilityReport } from "@/lib/api/eligibility";

const hospitalNames = [
  "Om Hospital",
  "Norvic International Hospital",
  "Nepal Medicity Hospital",
  "B & B Hospital",
];

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

interface Hospital {
  _id: string;
  name: string;
  email: string;
  phoneNumber: string;
  address: {
    city: string;
    state: string;
  };
}

interface UnifiedRequest {
  _id: string;
  requestType: "blood" | "organ";
  requesterName: string;
  hospitalName?: string;
  bloodType: string;
  unitsRequested?: number;
  status: string;
  createdAt: string;
  requestedBy?: string;
  contactPhone?: string;
  neededBy?: string;
  scheduledAt?: string;
  notes?: string;
  reportUrl?: string;
}

interface Donor {
  _id: string;
  firstName?: string;
  lastName?: string;
  email: string;
  createdAt: string;
}

export default function HospitalDashboardPage() {
  const apiBaseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5050";
  const [hospital, setHospital] = useState<Hospital | null>(null);
  const [requests, setRequests] = useState<UnifiedRequest[]>([]);
  const [hospitalOptions, setHospitalOptions] = useState<Hospital[]>([]);
  const [donors, setDonors] = useState<Donor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedRequest, setSelectedRequest] = useState<UnifiedRequest | null>(null);
  const [report, setReport] = useState<any>(null);
  const [reportLoading, setReportLoading] = useState(false);
  const [reportError, setReportError] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [seenNotificationIds, setSeenNotificationIds] = useState<string[]>([]);
  const [notificationTypeFilter, setNotificationTypeFilter] = useState<"all" | "blood" | "organ">("all");
  const [scheduleInput, setScheduleInput] = useState("");
  const [scheduleError, setScheduleError] = useState("");
  const [selectedHospitalName, setSelectedHospitalName] = useState("");
  const [requestTypeFilter, setRequestTypeFilter] = useState<"all" | "blood" | "organ">("all");

  const getReportUrl = (path?: string | null) => {
    if (!path) return null;
    if (path.startsWith("http")) return path;
    const normalized = path.startsWith("/") ? path : `/${path}`;
    return `${apiBaseUrl}${normalized}`;
  };

  useEffect(() => {
    const savedValue = window.localStorage.getItem("lifelink_hospital_seen_notification_ids");
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

    loadHospital();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const normalizeRequests = (
    requestsResponse: any,
    organRequestsResponse: any
  ) => {
    const bloodRequests = (requestsResponse?.data || []).map((item: any) => ({
      ...item,
      requestType: "blood",
      requesterName: item.patientName || "-",
      status: item.status || "pending",
    }));

    const organRequests = (organRequestsResponse?.data || []).map((item: any) => ({
      ...item,
      requestType: "organ",
      requesterName: item.donorName || "-",
      bloodType: "Organ",
      unitsRequested: undefined,
      status: item.status || "pending",
    }));

    setRequests([...bloodRequests, ...organRequests]);
  };

  const fetchRequests = async (hospitalName?: string, hospitalId?: string) => {
    try {
      setError("");
      const bloodResponse = await getRequests({
        hospitalId: hospitalId || undefined,
        hospitalName: hospitalName || undefined,
      });
      const organResponse = await getOrganRequests({
        hospitalId: hospitalId || undefined,
        hospitalName: hospitalName || undefined,
      });

      if (!bloodResponse.success && !organResponse.success) {
        setError(bloodResponse.message || organResponse.message || "Failed to load requests");
        setRequests([]);
        return;
      }

      normalizeRequests(bloodResponse, organResponse);
    } catch (err: any) {
      setError(err.message || "Failed to load requests");
    }
  };

  const loadHospital = async () => {
    try {
      setLoading(true);
      setError("");
      const userDataStr = Cookies.get("lifelink_user");
      const user = userDataStr ? JSON.parse(userDataStr) : null;

      const hospitalsResponse = await getHospitals();
      if (!hospitalsResponse.success) {
        setError(hospitalsResponse.message || "Failed to load hospital data");
        return;
      }

      const hospitals: Hospital[] = hospitalsResponse.data || [];
      setHospitalOptions(hospitals);
      const matchedHospital = user?.email
        ? hospitals.find((item) => item.email === user.email)
        : hospitals[0];

      if (!matchedHospital) {
        setHospital(null);
        return;
      }

      setHospital(matchedHospital);

      if (matchedHospital) {
        setSelectedHospitalName(matchedHospital.name);

        const [donorsResponse, requestsResponse, organRequestsResponse] = await Promise.all([
          getDonors(),
          getRequests({ hospitalId: matchedHospital._id, hospitalName: matchedHospital.name }),
          getOrganRequests({ hospitalId: matchedHospital._id, hospitalName: matchedHospital.name }),
        ]);

        if (donorsResponse.success) {
          setDonors(donorsResponse.data || []);
        }

        if (requestsResponse.success || organRequestsResponse.success) {
          normalizeRequests(requestsResponse, organRequestsResponse);
        }
      }
    } catch (err: any) {
      setError(err.message || "Failed to load hospital dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleHospitalChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const name = event.target.value;
    setSelectedHospitalName(name);
    const selected = hospitalOptions.find((item) => item.name === name);
    fetchRequests(name, selected?._id);
  };

  const handleHospitalSelectFocus = async () => {
    // Refresh hospital list when dropdown opens to catch newly created hospitals
    try {
      const response = await getHospitals();
      if (response.success && response.data) {
        setHospitalOptions(response.data);
      }
    } catch (err) {
      console.error("Failed to refresh hospitals:", err);
    }
  };

  const pendingRequestsCount = requests.filter(
    (request) => request.status === "pending"
  ).length;
  const bloodRequestsCount = requests.filter(
    (request) => request.requestType === "blood"
  ).length;
  const organRequestsCount = requests.filter(
    (request) => request.requestType === "organ"
  ).length;
  const approvedRequestsCount = requests.filter(
    (request) => request.status === "approved"
  ).length;
  const fulfilledRequestsCount = requests.filter(
    (request) => request.status === "fulfilled"
  ).length;
  const rejectedRequestsCount = requests.filter(
    (request) => request.status === "rejected"
  ).length;
  const recentDonors = [...donors]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4);
  const filteredRequests = requests.filter((request) => {
    if (requestTypeFilter === "all") {
      return true;
    }
    return request.requestType === requestTypeFilter;
  });

  const notifications = [...requests]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 8)
    .map((request) => ({
      id: `${request.requestType}-${request._id}`,
      requestType: request.requestType,
      title: request.requestType === "organ" ? "Organ request update" : "Blood request update",
      subtitle: `${request.requesterName || "Requester"} • ${request.status || "pending"}`,
      timeLabel: new Date(request.createdAt).toLocaleString(),
    }));

  const filteredNotifications = notifications.filter((item) => {
    if (notificationTypeFilter === "all") {
      return true;
    }
    return item.requestType === notificationTypeFilter;
  });

  const unreadCount = notifications.filter(
    (item) => !seenNotificationIds.includes(item.id)
  ).length;

  const markNotificationsAsRead = () => {
    const nextSeenIds = Array.from(
      new Set([...seenNotificationIds, ...notifications.map((item) => item.id)])
    );
    setSeenNotificationIds(nextSeenIds);
    window.localStorage.setItem(
      "lifelink_hospital_seen_notification_ids",
      JSON.stringify(nextSeenIds)
    );
  };

  const handleStatusUpdate = async (
    requestId: string,
    status: string,
    requestType: "blood" | "organ"
  ) => {
    try {
      const validStatus = status as "pending" | "approved" | "rejected" | "fulfilled";
      const response =
        requestType === "organ"
          ? await updateOrganRequest(requestId, { status: validStatus })
          : await updateRequest(requestId, { status: validStatus });
      if (response.success) {
        setRequests((prev) =>
          prev.map((item) =>
            item._id === requestId ? { ...item, status } : item
          )
        );
      }
    } catch (err: any) {
      setError(err.message || "Failed to update request");
    }
  };

  const handleSelectRequest = async (request: UnifiedRequest) => {
    setSelectedRequest(request);
    setReport(null);
    setReportError("");
    setScheduleError("");
    // Format date for HTML date input (YYYY-MM-DDTHH:MM format)
    if (request.scheduledAt) {
      const date = new Date(request.scheduledAt);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      setScheduleInput(`${year}-${month}-${day}T${hours}:${minutes}`);
    } else {
      setScheduleInput("");
    }

    if (request.requestType === "organ" || !request.requestedBy) {
      return;
    }

    try {
      setReportLoading(true);
      const response = await getLatestEligibilityReport(request.requestedBy);
      if (response.success) {
        setReport(response.data);
      } else {
        setReportError(response.message || "No report found");
      }
    } catch (err: any) {
      setReportError(err.message || "Failed to load report");
    } finally {
      setReportLoading(false);
    }
  };

  const handleApproveWithSchedule = async () => {
    if (!selectedRequest) {
      return;
    }

    if (!scheduleInput) {
      setScheduleError("Please set the donation time.");
      return;
    }

    try {
      const updateData: any = {
        scheduledAt: scheduleInput, // send date string directly
      };

      // Only set status to approved if it's currently pending
      if (selectedRequest.status === "pending") {
        updateData.status = "approved";
      }

      const response =
        selectedRequest.requestType === "organ"
          ? await updateOrganRequest(selectedRequest._id, updateData)
          : await updateRequest(selectedRequest._id, updateData);

      if (response.success) {
        setRequests((prev) =>
          prev.map((item) =>
            item._id === selectedRequest._id
              ? {
                  ...item,
                  status: updateData.status || selectedRequest.status,
                  scheduledAt: scheduleInput,
                }
              : item
          )
        );
        setScheduleError("");
        setSelectedRequest(null); // Close the request details panel
      }
    } catch (err: any) {
      setScheduleError(err.message || "Failed to schedule request");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-emerald-50 text-emerald-700";
      case "rejected":
        return "bg-red-50 text-red-700";
      case "fulfilled":
        return "bg-indigo-50 text-indigo-700";
      default:
        return "bg-amber-50 text-amber-700";
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(1200px_circle_at_top,#eef2ff,#fff1f2_45%,#f8fafc_70%)] text-zinc-900">
      <header className="sticky top-0 z-50 border-b border-white/70 bg-white/85 backdrop-blur">
        <div className="mx-auto max-w-6xl px-6 py-6">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#d4002a]">
                Hospital Console
              </p>
              <h1 className="mt-2 text-3xl font-semibold text-zinc-900">
                {hospital?.name || "Hospital Dashboard"}
              </h1>
              <p className="mt-1 text-sm text-zinc-500">
                {hospital
                  ? `${hospital.address.city}, ${hospital.address.state} • ${hospital.email}`
                  : "Monitor inventory, donor readiness, and live requests"}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="relative isolate">
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
                  <div className="absolute right-0 top-full z-120 mt-2 w-80 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-xl">
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
                    <div className="border-b border-zinc-100 px-4 py-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-medium text-zinc-500">Type</span>
                        <select
                          value={notificationTypeFilter}
                          onChange={(event) =>
                            setNotificationTypeFilter(
                              event.target.value as "all" | "blood" | "organ"
                            )
                          }
                          className="rounded-md border border-zinc-300 bg-white px-2 py-1 text-xs text-zinc-700"
                        >
                          <option value="all">All</option>
                          <option value="blood">Blood</option>
                          <option value="organ">Organ</option>
                        </select>
                      </div>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {filteredNotifications.length === 0 ? (
                        <p className="px-4 py-6 text-sm text-zinc-500">No notifications yet.</p>
                      ) : (
                        filteredNotifications.map((item) => (
                          <div key={item.id} className="border-b border-zinc-100 px-4 py-3 last:border-b-0">
                            <p className="text-sm font-medium text-zinc-900">{item.title}</p>
                            <p className="mt-0.5 text-xs text-zinc-600">{item.subtitle}</p>
                            <p className="mt-1 text-[11px] text-zinc-500">{item.timeLabel}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="rounded-full border border-white/70 bg-white/80 px-4 py-2 text-xs font-semibold text-zinc-600">
                Active Hospital
              </div>
              <select
                value={selectedHospitalName || (hospitalOptions.length > 0 ? hospitalOptions[0]?.name : "")}
                onChange={handleHospitalChange}
                onFocus={handleHospitalSelectFocus}
                className="rounded-xl border border-white/70 bg-white/90 px-4 py-2 text-sm text-zinc-700 shadow-sm"
              >
                {(hospitalOptions.length ? hospitalOptions : hospitalNames).map((item) => (
                  <option
                    key={typeof item === "object" ? item._id : item}
                    value={typeof item === "object" ? item.name : item}
                  >
                    {typeof item === "object" ? item.name : item}
                  </option>
                ))}
              </select>
              <form action={handleLogout}>
                <button type="submit" className="btn-secondary">
                  Logout
                </button>
              </form>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-8 px-6 py-10">
        {loading && (
          <Card className="p-6 text-sm text-zinc-600">
            Loading hospital dashboard...
          </Card>
        )}
        {error && <Card className="p-6 text-sm text-red-600">{error}</Card>}

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { label: "Active Requests", value: requests.length, accent: "bg-rose-50" },
            { label: "Total Donors", value: donors.length, accent: "bg-sky-50" },
            { label: "Pending Requests", value: pendingRequestsCount, accent: "bg-amber-50" },
          ].map((stat) => (
            <Card key={stat.label} className="p-5">
              <div
                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold text-zinc-600 ${stat.accent}`}
              >
                {stat.label}
              </div>
              <p className="mt-3 text-2xl font-semibold text-zinc-900">
                {stat.value}
              </p>
            </Card>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.75fr_1.25fr]">
          <aside className="space-y-6 lg:sticky lg:top-24 self-start">
            <Card className="p-6">
              <SectionHeader
                eyebrow="Profile"
                title="Hospital Overview"
                subtitle="Key contact information and current focus."
              />
              <div className="mt-4 space-y-2 text-sm text-zinc-600">
                <div className="font-semibold text-zinc-900">
                  {hospital?.name || "Hospital"}
                </div>
                <div>{hospital?.email || ""}</div>
                <div>
                  {hospital
                    ? `${hospital.address.city}, ${hospital.address.state}`
                    : ""}
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <SectionHeader
                eyebrow="Overview"
                title="Request Pipeline"
                subtitle="Live status breakdown for this hospital."
              />
              <div className="mt-4 space-y-3 text-sm">
                <div className="flex items-center justify-between rounded-lg border border-zinc-200 bg-white px-3 py-2">
                  <span className="text-zinc-600">Pending</span>
                  <span className="font-semibold text-amber-700">{pendingRequestsCount}</span>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-zinc-200 bg-white px-3 py-2">
                  <span className="text-zinc-600">Approved</span>
                  <span className="font-semibold text-emerald-700">{approvedRequestsCount}</span>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-zinc-200 bg-white px-3 py-2">
                  <span className="text-zinc-600">Fulfilled</span>
                  <span className="font-semibold text-indigo-700">{fulfilledRequestsCount}</span>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-zinc-200 bg-white px-3 py-2">
                  <span className="text-zinc-600">Rejected</span>
                  <span className="font-semibold text-red-700">{rejectedRequestsCount}</span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <SectionHeader
                eyebrow="Donors"
                title="Recent Donors"
                subtitle="Recently registered donors in the system."
              />
              <div className="mt-4 space-y-3">
                {recentDonors.length === 0 ? (
                  <p className="text-sm text-zinc-500">No donor records yet.</p>
                ) : (
                  recentDonors.map((donor) => (
                    <div
                      key={donor._id}
                      className="rounded-lg border border-zinc-200 bg-white px-3 py-2"
                    >
                      <p className="text-sm font-semibold text-zinc-900">
                        {[donor.firstName, donor.lastName].filter(Boolean).join(" ") || "Donor"}
                      </p>
                      <p className="text-xs text-zinc-500">{donor.email}</p>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </aside>

          <div className="space-y-6">
            <Card className="p-6">
              <SectionHeader
                eyebrow="Operations"
                title="Donation Requests"
                subtitle={`Showing requests for ${selectedHospitalName}`}
              />
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs font-semibold">
                  <span className="rounded-full bg-rose-50 px-3 py-1 text-rose-700">
                    Blood: {bloodRequestsCount}
                  </span>
                  <span className="rounded-full bg-purple-50 px-3 py-1 text-purple-700">
                    Organ: {organRequestsCount}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <label htmlFor="requestTypeFilter" className="text-xs font-medium text-zinc-500">
                    Filter Type
                  </label>
                  <select
                    id="requestTypeFilter"
                    value={requestTypeFilter}
                    onChange={(event) =>
                      setRequestTypeFilter(event.target.value as "all" | "blood" | "organ")
                    }
                    className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-700"
                  >
                    <option value="all">All</option>
                    <option value="blood">Blood</option>
                    <option value="organ">Organ</option>
                  </select>
                </div>
              </div>
              {filteredRequests.length === 0 ? (
                <div className="mt-4 rounded-xl border border-zinc-100 bg-white p-4 text-sm text-zinc-500">
                  No {requestTypeFilter === "all" ? "request" : requestTypeFilter} request data yet for {selectedHospitalName || "selected hospital"}
                </div>
              ) : (
                <div className="mt-4 overflow-hidden rounded-xl border border-zinc-100 bg-white">
                  <table className="w-full text-sm">
                    <thead className="bg-zinc-50 text-left text-xs uppercase text-zinc-500">
                      <tr>
                        <th className="px-4 py-3 font-medium">Requester</th>
                        <th className="px-4 py-3 font-medium">Blood</th>
                        <th className="px-4 py-3 font-medium">Units</th>
                        <th className="px-4 py-3 font-medium">Status</th>
                        <th className="px-4 py-3 font-medium">Date</th>
                        <th className="px-4 py-3 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                      {filteredRequests.slice(0, 8).map((request) => (
                        <tr key={request._id}>
                          <td className="px-4 py-3 text-zinc-700">
                            {request.requesterName}
                          </td>
                          <td className="px-4 py-3 text-zinc-700">
                            {request.requestType === "organ" ? "Organ" : request.bloodType}
                          </td>
                          <td className="px-4 py-3 text-zinc-700">
                            {request.requestType === "organ" ? "-" : request.unitsRequested ?? "-"}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusBadge(
                                request.status || "pending"
                              )}`}
                            >
                              {request.status || "pending"}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-zinc-500">
                            {new Date(request.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex flex-wrap gap-2">
                              <button
                                type="button"
                                onClick={() => handleSelectRequest(request)}
                                className="btn-ghost text-xs"
                              >
                                Details
                              </button>
                              <button
                                type="button"
                                onClick={() => handleStatusUpdate(request._id, "rejected", request.requestType)}
                                disabled={request.status !== "pending"}
                                className="btn-ghost text-xs text-red-600 disabled:opacity-40"
                              >
                                Reject
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

            <Card className="p-6">
              <SectionHeader
                eyebrow="Review"
                title="Request Details"
                subtitle="Eligibility history, notes, and scheduling."
              />
              {!selectedRequest ? (
                <div className="mt-4 rounded-xl border border-zinc-100 bg-white p-4 text-sm text-zinc-500">
                  Select a request to view donor history and notes.
                </div>
              ) : (
                <div className="mt-4 space-y-4 text-sm text-zinc-600">
                  <div>
                    <span className="text-xs uppercase tracking-wide text-zinc-400">Requester</span>
                    <div className="font-semibold text-zinc-900">
                      {selectedRequest.requesterName}
                    </div>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <span className="text-xs uppercase tracking-wide text-zinc-400">Blood Type</span>
                      <div className="font-semibold text-zinc-900">
                        {selectedRequest.requestType === "organ" ? "Organ" : selectedRequest.bloodType}
                      </div>
                    </div>
                    <div>
                      <span className="text-xs uppercase tracking-wide text-zinc-400">Units</span>
                      <div className="font-semibold text-zinc-900">
                        {selectedRequest.requestType === "organ"
                          ? "-"
                          : selectedRequest.unitsRequested ?? "-"}
                      </div>
                    </div>
                    <div>
                      <span className="text-xs uppercase tracking-wide text-zinc-400">Contact</span>
                      <div className="font-semibold text-zinc-900">
                        {selectedRequest.contactPhone || "-"}
                      </div>
                    </div>
                  </div>
                  <div className="rounded-lg border border-zinc-200 bg-white p-4">
                    <div className="text-xs uppercase tracking-wide text-zinc-400">
                      Donation Time
                    </div>
                    <div className="mt-2">
                      <input
                        type="datetime-local"
                        value={scheduleInput}
                        onChange={(event) => setScheduleInput(event.target.value)}
                        className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900"
                      />
                    </div>
                    {scheduleError && (
                      <p className="mt-2 text-xs text-red-600">{scheduleError}</p>
                    )}
                    <div className="mt-3 flex items-center gap-3">
                      <button
                        type="button"
                        onClick={handleApproveWithSchedule}
                        disabled={
                          !scheduleInput ||
                          (selectedRequest.status !== "pending" && selectedRequest.status !== "approved")
                        }
                        className="btn-primary bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200/60 disabled:opacity-40"
                      >
                        {selectedRequest.status === "approved" ? "Update Schedule" : "Approve & Schedule"}
                      </button>
                      {selectedRequest.scheduledAt && (
                        <span className="text-xs text-zinc-500">
                          Scheduled for {new Date(selectedRequest.scheduledAt).toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                  {selectedRequest.requestType === "organ" && (
                    <div>
                      <span className="text-xs uppercase tracking-wide text-zinc-400">Health Report</span>
                      <div className="mt-1 rounded-lg bg-zinc-50 px-3 py-2 text-zinc-700">
                        {selectedRequest.reportUrl ? (
                          <a
                            href={getReportUrl(selectedRequest.reportUrl) || "#"}
                            className="text-sm text-blue-600 hover:underline"
                            target="_blank"
                            rel="noreferrer"
                          >
                            View report
                          </a>
                        ) : (
                          "No report attached"
                        )}
                      </div>
                    </div>
                  )}
                  <div>
                    <span className="text-xs uppercase tracking-wide text-zinc-400">Notes</span>
                    <div className="mt-1 rounded-lg bg-zinc-50 px-3 py-2 text-zinc-700">
                      {selectedRequest.notes || "No notes"}
                    </div>
                  </div>

                  {selectedRequest.requestType === "blood" && (
                    <div>
                      <span className="text-xs uppercase tracking-wide text-zinc-400">Eligibility Report</span>
                      <div className="mt-2 rounded-lg border border-zinc-100 bg-white p-3">
                        {reportLoading && (
                          <div className="text-xs text-zinc-500">Loading report...</div>
                        )}
                        {!reportLoading && reportError && (
                          <div className="text-xs text-red-600">{reportError}</div>
                        )}
                        {!reportLoading && !reportError && report && (
                          <div className="space-y-1 text-xs text-zinc-600">
                            <div>Age: {report.age}</div>
                            <div>Weight: {report.weight} kg</div>
                            <div>Gender: {report.gender}</div>
                            <div>Total Donations: {report.totalDonationsCount ?? 0}</div>
                          </div>
                        )}
                        {!reportLoading && !reportError && !report && (
                          <div className="text-xs text-zinc-500">No report available</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
}
