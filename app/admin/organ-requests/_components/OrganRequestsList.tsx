"use client";

import { useEffect, useState } from "react";
import SectionHeader from "@/app/_components/SectionHeader";
import { getOrganRequests, updateOrganRequest } from "@/lib/api/admin/organ-donations";
import { useAdminSearch } from "../../context/AdminContext";

interface OrganRequestItem {
  _id: string;
  hospitalName: string;
  donorName: string;
  requestedBy?: string;
  reportUrl?: string;
  status: string;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

const statusOptions = ["pending", "approved", "rejected", "fulfilled"];

export default function OrganRequestsList() {
  const { searchQuery } = useAdminSearch();
  const [requests, setRequests] = useState<OrganRequestItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState<Record<string, boolean>>({});
  const [filterStatus, setFilterStatus] = useState<string>("all");

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await getOrganRequests();
      if (response.success) {
        setRequests(response.data || []);
      } else {
        setError(response.message || "Failed to load organ requests");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load organ requests";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      setUpdating((prev) => ({ ...prev, [id]: true }));
      const response = await updateOrganRequest(id, { 
        status: status as "pending" | "approved" | "rejected" | "fulfilled" 
      });
      if (response.success && response.data) {
        setRequests((prev) =>
          prev.map((item) => (item._id === id ? response.data : item))
        );
      } else {
        setError(response.message || "Failed to update status");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to update status";
      setError(message);
    } finally {
      setUpdating((prev) => ({ ...prev, [id]: false }));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-700 border-green-200";
      case "rejected":
        return "bg-red-100 text-red-700 border-red-200";
      case "fulfilled":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "pending":
      default:
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredByStatus = filterStatus === "all"
    ? requests
    : requests.filter((req) => req.status === filterStatus);

  const filteredRequests = normalizedQuery
    ? filteredByStatus.filter((request) =>
        [
          request.donorName,
          request.hospitalName,
          request.status,
          request.notes,
        ]
          .filter((value): value is string => Boolean(value))
          .some((value) => value.toLowerCase().includes(normalizedQuery))
      )
    : filteredByStatus;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-zinc-600">Loading organ donation requests...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Admin"
        title="Organ Donation Requests"
        subtitle="Review organ donation requests and manage their status."
      />

      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
          ✕ {error}
          <button
            onClick={loadRequests}
            className="ml-4 underline hover:no-underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* Filter Bar */}
      <div className="flex items-center gap-4 rounded-lg border border-zinc-200 bg-white px-6 py-4">
        <label className="text-sm font-semibold text-zinc-700">
          Filter by Status:
        </label>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="rounded-lg border border-zinc-300 px-4 py-2 text-sm focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-200"
        >
          <option value="all">All Requests</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="fulfilled">Fulfilled</option>
        </select>
        <div className="ml-auto text-sm text-zinc-600">
          {filteredRequests.length} request{filteredRequests.length !== 1 ? 's' : ''}
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50">
                <th className="px-6 py-4 text-left font-semibold text-zinc-900">
                  Donor Name
                </th>
                <th className="px-6 py-4 text-left font-semibold text-zinc-900">
                  Hospital
                </th>
                <th className="px-6 py-4 text-left font-semibold text-zinc-900">
                  Health Report
                </th>
                <th className="px-6 py-4 text-left font-semibold text-zinc-900">
                  Status
                </th>
                <th className="px-6 py-4 text-left font-semibold text-zinc-900">
                  Notes
                </th>
                <th className="px-6 py-4 text-left font-semibold text-zinc-900">
                  Submitted
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-zinc-600"
                  >
                    No organ donation requests found
                  </td>
                </tr>
              ) : (
                filteredRequests.map((request) => (
                  <tr
                    key={request._id}
                    className="border-b border-zinc-100 transition hover:bg-zinc-50"
                  >
                    <td className="px-6 py-4 text-zinc-900">
                      <div className="font-medium">{request.donorName}</div>
                      {request.requestedBy && (
                        <div className="text-xs text-zinc-500">
                          ID: {request.requestedBy.slice(0, 8)}...
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-zinc-700">
                      {request.hospitalName}
                    </td>
                    <td className="px-6 py-4">
                      {request.reportUrl ? (
                        <a
                          href={request.reportUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 hover:underline"
                        >
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                          View Report
                        </a>
                      ) : (
                        <span className="text-zinc-400">No report</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={request.status}
                        onChange={(e) =>
                          handleStatusChange(request._id, e.target.value)
                        }
                        disabled={updating[request._id]}
                        className={`rounded-lg border px-3 py-1.5 text-xs font-semibold uppercase transition focus:outline-none focus:ring-2 focus:ring-zinc-300 disabled:opacity-50 ${getStatusColor(
                          request.status
                        )}`}
                      >
                        {statusOptions.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="max-w-xs px-6 py-4 text-zinc-600">
                      {request.notes ? (
                        <div className="truncate" title={request.notes}>
                          {request.notes}
                        </div>
                      ) : (
                        <span className="text-zinc-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-zinc-500">
                      {formatDate(request.createdAt)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
