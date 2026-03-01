"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import SectionHeader from "@/app/_components/SectionHeader";
import { useAuth } from "@/app/context/AuthContext";
import {
  createRequest,
  deleteRequest,
  getRequestById,
  getRequests,
  updateRequest,
} from "@/lib/api/donor/donations";
import { serverGetBloodRequests } from "@/lib/actions/donor/blood-donation-actions";
import { checkEligibility } from "@/lib/api/donor/eligibility";
import { RequestData, requestSchema } from "../schema";
// import { requestSchema, type RequestData } from "./schema";

const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const hospitalNames = [
  "Om Hospital",
  "Norvic International Hospital",
  "Nepal Medicity Hospital",
  "B & B Hospital",
];

interface RequestItem {
  _id: string;
  hospitalName: string;
  patientName: string;
  bloodType: string;
  unitsRequested: number;
  status: string;
  createdAt: string;
  contactPhone?: string;
  notes?: string;
}

export default function RequestPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const viewOnly = searchParams.get("viewOnly") === "true";
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [requestsLoading, setRequestsLoading] = useState(false);
  const [requestsError, setRequestsError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const editId = searchParams.get("edit");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<RequestData>({
    resolver: zodResolver(requestSchema),
    defaultValues: {
      hospitalName: "",
      patientName: "",
      bloodType: "",
      unitsRequested: 1,
      contactPhone: "",
      notes: "",
    },
  });

  const applyRequestValues = (data: RequestItem) => {
    reset({
      hospitalName: data.hospitalName || "",
      patientName: data.patientName || "",
      bloodType: data.bloodType || "",
      unitsRequested: data.unitsRequested ?? 1,
      contactPhone: data.contactPhone || "",
      notes: data.notes || "",
    });
  };

  // Auto-detect edit mode from ?edit={id} in URL
  useEffect(() => {
    if (!editId) {
      if (editingId) {
        setEditingId(null);
        reset();
      }
      return;
    }

    if (editId !== editingId) {
      setEditingId(editId);
    }

    setSuccess("");
    setError("");

    const cachedRequest = requests.find((item) => item._id === editId);
    if (cachedRequest) {
      applyRequestValues(cachedRequest);
    }

    let isActive = true;
    const loadForEdit = async () => {
      setLoading(true);
      try {
        const response = await getRequestById(editId);
        if (!isActive) return;
        if (response.success && response.data) {
          applyRequestValues(response.data);
        } else if (!cachedRequest) {
          setError(response.message || "Failed to fetch request data for editing");
        }
      } catch (err: any) {
        if (!isActive) return;
        if (!cachedRequest) {
          setError(err.message || "Failed to fetch request data for editing");
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    loadForEdit();

    return () => {
      isActive = false;
    };
  }, [editId, editingId, requests, reset]);

  useEffect(() => {
    const loadHospitals = async () => {
      try {
        setLoading(true);
        const eligibility = await checkEligibility();
        if (!eligibility?.data?.eligible) {
          router.push("/eligibility");
          return;
        }
      } catch (err: any) {
        router.push("/eligibility");
      } finally {
        setLoading(false);
      }
    };

    loadHospitals();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const loadRequests = async () => {
      try {
        setRequestsLoading(true);
        setRequestsError("");
        
        if (!user?._id) {
          setRequests([]);
          setRequestsLoading(false);
          return;
        }
        
        const response = await serverGetBloodRequests({ requestedBy: user._id });
        if (response.success) {
          const apiData = response.data;
          const requestsArray = apiData?.success && apiData?.data
            ? apiData.data
            : Array.isArray(apiData)
              ? apiData
              : [];
          setRequests(requestsArray);
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
  }, [user?._id]);

  const onSubmit = async (values: RequestData) => {
    setError("");
    setSuccess("");
    try {
      let response;
      if (editingId) {
        response = await updateRequest(editingId, {
          hospitalName: values.hospitalName,
          patientName: values.patientName.trim(),
          bloodType: values.bloodType,
          unitsRequested: values.unitsRequested,
          contactPhone: values.contactPhone?.trim() || undefined,
          notes: values.notes?.trim() || undefined,
        });
      } else {
        response = await createRequest({
          hospitalName: values.hospitalName,
          patientName: values.patientName.trim(),
          bloodType: values.bloodType,
          unitsRequested: values.unitsRequested,
          contactPhone: values.contactPhone?.trim() || undefined,
          notes: values.notes?.trim() || undefined,
        });
      }

      if (!response.success) {
        setError(response.message || (editingId ? "Failed to update request" : "Failed to submit request"));
        return;
      }

      if (response.data) {
        if (editingId) {
          setRequests((prev) => prev.map((item) => (item._id === editingId ? response.data : item)));
        } else {
          setRequests((prev) => [response.data, ...prev]);
        }
      }

      setSuccess(editingId ? "Request updated successfully" : "Request submitted successfully");
      reset();
      setEditingId(null);
      setTimeout(() => {
        router.push("/dashboard");
      }, 800);
    } catch (err: any) {
      setError(err.message || (editingId ? "Failed to update request" : "Failed to submit request"));
    }
  };

  const handleStartEdit = async (request: RequestItem) => {
    setEditingId(request._id);
    setSuccess("");
    setError("");
    try {
      setLoading(true);
      // Fetch latest data from backend
      const response = await import("@/lib/api/donor/donations").then(mod => mod.getRequestById(request._id));
      if (response.success && response.data) {
        reset({
          hospitalName: response.data.hospitalName || "",
          patientName: response.data.patientName || "",
          bloodType: response.data.bloodType || "",
          unitsRequested: response.data.unitsRequested ?? 1,
          contactPhone: response.data.contactPhone || "",
          notes: response.data.notes || "",
        });
      } else {
        setError(response.message || "Failed to fetch request data for editing");
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch request data for editing");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    reset();
    setSuccess("");
    setError("");
    router.push("/dashboard");
  };


  const handleDeleteRequest = async (id: string) => {
    setRequestsError("");

    try {
      const response = await deleteRequest(id);
      if (response.success) {
        setRequests((prev) => prev.filter((item) => item._id !== id));
        setDeleteConfirmId(null);
      } else {
        setRequestsError(response.message || "Failed to delete request");
      }
    } catch (err: any) {
      setRequestsError(err.message || "Failed to delete request");
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
    <div className="min-h-screen bg-[radial-gradient(1000px_circle_at_top,_#fff1f2,_#f8fafc_60%,_#eef2ff)] px-6 py-10 text-zinc-900">
      <div className="mx-auto max-w-3xl space-y-6">
        {!viewOnly && (
          <>
            <SectionHeader
              eyebrow="Request"
              title="Request Blood"
              subtitle="Submit a request to the hospital of your choice."
            />

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="rounded-2xl border border-white/70 bg-white/90 p-8 shadow-xl shadow-slate-200/60 backdrop-blur"
            >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="text-sm font-medium text-zinc-700">Hospital</label>
              <select
                {...register("hospitalName")}
                className="mt-2 w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 outline-none focus:border-[#d4002a] focus:ring-4 focus:ring-red-100"
                disabled={loading}
              >
                <option value="">Select hospital</option>
                {loading && <option value="" disabled>Checking eligibility...</option>}
                {hospitalNames.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
              {errors.hospitalName && (
                <p className="mt-1 text-xs text-red-600">{errors.hospitalName.message}</p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-zinc-700">Patient Name</label>
              <input
                {...register("patientName")}
                className="mt-2 w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm text-zinc-900 outline-none focus:border-[#d4002a] focus:ring-4 focus:ring-red-100"
                placeholder="Patient name"
              />
              {errors.patientName && (
                <p className="mt-1 text-xs text-red-600">{errors.patientName.message}</p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-zinc-700">Blood Type</label>
              <select
                {...register("bloodType")}
                className="mt-2 w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 outline-none focus:border-[#d4002a] focus:ring-4 focus:ring-red-100"
              >
                <option value="">Select blood type</option>
                {bloodTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              {errors.bloodType && (
                <p className="mt-1 text-xs text-red-600">{errors.bloodType.message}</p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-zinc-700">Units Needed</label>
              <input
                type="number"
                min={1}
                {...register("unitsRequested", { valueAsNumber: true })}
                className="mt-2 w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm text-zinc-900 outline-none focus:border-[#d4002a] focus:ring-4 focus:ring-red-100"
              />
              {errors.unitsRequested && (
                <p className="mt-1 text-xs text-red-600">{errors.unitsRequested.message}</p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-zinc-700">Contact Phone</label>
              <input
                {...register("contactPhone")}
                className="mt-2 w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm text-zinc-900 outline-none focus:border-[#d4002a] focus:ring-4 focus:ring-red-100"
                placeholder="98xxxxxxxx"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-sm font-medium text-zinc-700">Notes</label>
              <textarea
                {...register("notes")}
                className="mt-2 min-h-[120px] w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm text-zinc-900 outline-none focus:border-[#d4002a] focus:ring-4 focus:ring-red-100"
                placeholder="Additional notes"
              />
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-3">
            {error && (
              <p className="mr-auto text-sm text-red-600">{error}</p>
            )}
            {success && (
              <p className="mr-auto text-sm text-emerald-600">{success}</p>
            )}
            <button
              type="button"
              onClick={editingId ? handleCancelEdit : () => router.push("/dashboard")}
              className="btn-secondary"
              disabled={isSubmitting}
            >
              {editingId ? "Cancel Edit" : "Cancel"}
            </button>
            <button type="submit" className="btn-primary" disabled={isSubmitting}>
              {isSubmitting ? (editingId ? "Updating..." : "Submitting...") : (editingId ? "Update Request" : "Submit Request")}
            </button>
          </div>
        </form>
          </>
        )}

        <div className="pt-4">
          <SectionHeader
            eyebrow="History"
            title="Your Requests"
            subtitle="Update or delete pending requests."
          />

          {requestsLoading ? (
            <div className="mt-4 rounded-xl border border-zinc-100 bg-white p-4 text-sm text-zinc-500">
              Loading requests...
            </div>
          ) : requestsError ? (
            <div className="mt-4 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-600">
              {requestsError}
            </div>
          ) : requests.length === 0 ? (
            <div className="mt-4 rounded-xl border border-zinc-100 bg-white p-4 text-sm text-zinc-500">
              You have not submitted any requests yet.
            </div>
          ) : (
            <div className="mt-4 overflow-hidden rounded-xl border border-zinc-100 bg-white">
              <table className="w-full text-sm">
                <thead className="bg-zinc-50 text-left text-xs uppercase text-zinc-500">
                  <tr>
                    <th className="px-4 py-3 font-medium">Hospital</th>
                    <th className="px-4 py-3 font-medium">Patient</th>
                    <th className="px-4 py-3 font-medium">Blood</th>
                    <th className="px-4 py-3 font-medium">Units</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Date</th>
                    <th className="px-4 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {requests.map((request) => {
                    const isPending = request.status === "pending";
                    return (
                      <tr key={request._id}>
                        <td className="px-4 py-3 text-zinc-700">
                          {request.hospitalName}
                        </td>
                        <td className="px-4 py-3 text-zinc-700">
                          {request.patientName}
                        </td>
                        <td className="px-4 py-3 text-zinc-700">
                          {request.bloodType}
                        </td>
                        <td className="px-4 py-3 text-zinc-700">
                          {request.unitsRequested}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusBadge(
                              request.status
                            )}`}
                          >
                            {request.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-zinc-500">
                          {new Date(request.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => handleStartEdit(request)}
                              disabled={!isPending}
                              className="btn-ghost text-xs disabled:opacity-40"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteConfirmId(request._id)}
                              disabled={!isPending}
                              className="btn-ghost text-xs text-red-600 disabled:opacity-40"
                            >
                              Delete
                            </button>
                          </div>
                          {!isPending && (
                            <p className="mt-1 text-xs text-zinc-400">
                              Only pending requests can be changed.
                            </p>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Edit section removed: editing now uses the main form above */}
        </div>

        {deleteConfirmId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-md rounded-xl border border-zinc-200 bg-white p-6 shadow-xl">
              <h3 className="text-lg font-semibold text-zinc-900">Delete Request?</h3>
              <p className="mt-2 text-sm text-zinc-600">
                Are you sure you want to delete this request? This action cannot be undone.
              </p>
              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => handleDeleteRequest(deleteConfirmId)}
                  className="flex-1 rounded-lg bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700 transition"
                >
                  Delete
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteConfirmId(null)}
                  className="flex-1 rounded-lg border border-zinc-300 px-4 py-2 font-semibold text-zinc-900 hover:bg-zinc-50 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
