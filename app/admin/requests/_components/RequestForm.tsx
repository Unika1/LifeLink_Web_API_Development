"use client";

import { useEffect, useState } from "react";
import SectionHeader from "@/app/_components/SectionHeader";
import { getRequests, updateRequest } from "@/lib/api/requests";

interface RequestItem {
  _id: string;
  hospitalName: string;
  patientName: string;
  bloodType: string;
  unitsRequested: number;
  status: string;
  createdAt: string;
  contactPhone?: string;
  neededBy?: string;
}

const statusOptions = ["pending", "approved", "rejected", "fulfilled"];

export default function AdminRequestsPage() {
  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const loadRequests = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await getRequests();
        if (response.success) {
          setRequests(response.data || []);
        } else {
          setError(response.message || "Failed to load requests");
        }
      } catch (err: any) {
        setError(err.message || "Failed to load requests");
      } finally {
        setLoading(false);
      }
    };

    loadRequests();
  }, []);

  const handleStatusChange = async (id: string, status: string) => {
    try {
      setUpdating((prev) => ({ ...prev, [id]: true }));
      const response = await updateRequest(id, { status });
      if (response.success && response.data) {
        setRequests((prev) =>
          prev.map((item) => (item._id === id ? response.data : item))
        );
      } else {
        setError(response.message || "Failed to update status");
      }
    } catch (err: any) {
      setError(err.message || "Failed to update status");
    } finally {
      setUpdating((prev) => ({ ...prev, [id]: false }));
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-zinc-600">Loading requests...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Admin"
        title="Blood Requests"
        subtitle="Review and update blood request status."
      />

      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
          ✕ {error}
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50">
                <th className="px-6 py-4 text-left font-semibold text-zinc-900">
                  Patient
                </th>
                <th className="px-6 py-4 text-left font-semibold text-zinc-900">
                  Hospital
                </th>
                <th className="px-6 py-4 text-left font-semibold text-zinc-900">
                  Blood
                </th>
                <th className="px-6 py-4 text-left font-semibold text-zinc-900">
                  Units
                </th>
                <th className="px-6 py-4 text-left font-semibold text-zinc-900">
                  Status
                </th>
                <th className="px-6 py-4 text-left font-semibold text-zinc-900">
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {requests.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-zinc-600"
                  >
                    No requests found
                  </td>
                </tr>
              ) : (
                requests.map((request) => (
                  <tr
                    key={request._id}
                    className="border-b border-zinc-100 transition hover:bg-zinc-50"
                  >
                    <td className="px-6 py-4 text-zinc-900">
                      {request.patientName}
                      {request.contactPhone && (
                        <div className="text-xs text-zinc-500">
                          {request.contactPhone}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-zinc-600">
                      {request.hospitalName}
                    </td>
                    <td className="px-6 py-4 text-zinc-600">
                      {request.bloodType}
                    </td>
                    <td className="px-6 py-4 text-zinc-600">
                      {request.unitsRequested}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={request.status}
                        onChange={(event) =>
                          handleStatusChange(request._id, event.target.value)
                        }
                        className="rounded-lg border border-zinc-200 bg-white px-3 py-1 text-sm text-zinc-700"
                        disabled={updating[request._id]}
                      >
                        {statusOptions.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4 text-zinc-500">
                      {new Date(request.createdAt).toLocaleDateString()}
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
