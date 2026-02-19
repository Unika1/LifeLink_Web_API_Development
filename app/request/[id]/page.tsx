"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { getRequestById } from "@/lib/api/requests";

// Ensure this is treated as a dynamic route
export const dynamic = "force-dynamic";

export default function RequestDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const hasId = Boolean(id);
  const [request, setRequest] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) {
      return;
    }
    let isMounted = true;
    setError("");
    console.log("Fetching request with ID:", id);
    getRequestById(id)
      .then((res) => {
        if (!isMounted) return;
        console.log("Response:", res);
        if (res.success && res.data) {
          setRequest(res.data);
          setError("");
        } else {
          setError(res.message || "Request not found");
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error("Error:", err);
        setError(err.message || "Failed to fetch request");
      })
      .finally(() => {});
    return () => {
      isMounted = false;
    };
  }, [id]);

  const loading = hasId && !request && !error;

  const getStatusBadge = (status: string) => {
    if (status === "approved") return "bg-emerald-50 text-emerald-700";
    if (status === "rejected") return "bg-red-50 text-red-700";
    if (status === "fulfilled") return "bg-indigo-50 text-indigo-700";
    return "bg-amber-50 text-amber-700";
  };

  if (!hasId) return (
    <div className="min-h-screen bg-[radial-gradient(1100px_circle_at_top,#fff1f2,#f8fafc_60%,#e0f2fe)] flex items-center justify-center">
      <div className="text-zinc-600">Invalid request ID.</div>
    </div>
  );

  if (loading) return (
    <div className="min-h-screen bg-[radial-gradient(1100px_circle_at_top,#fff1f2,#f8fafc_60%,#e0f2fe)] flex items-center justify-center">
      <div className="text-zinc-600">Loading request details...</div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-[radial-gradient(1100px_circle_at_top,#fff1f2,#f8fafc_60%,#e0f2fe)] flex items-center justify-center p-4">
      <div className="max-w-md text-center">
        <p className="text-red-600 font-semibold">{error}</p>
        <button onClick={() => router.back()} className="mt-4 text-indigo-600 hover:underline">
          Go Back
        </button>
      </div>
    </div>
  );

  if (!request) return (
    <div className="min-h-screen bg-[radial-gradient(1100px_circle_at_top,#fff1f2,#f8fafc_60%,#e0f2fe)] flex items-center justify-center">
      <div className="text-zinc-600">No request found.</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[radial-gradient(1100px_circle_at_top,#fff1f2,#f8fafc_60%,#e0f2fe)] text-zinc-900">
      <header className="border-b border-white/70 bg-white/70 backdrop-blur sticky top-0 z-30">
        <div className="mx-auto max-w-4xl px-6 py-4">
          <button onClick={() => router.back()} className="text-sm font-semibold text-indigo-600 hover:underline">
            ← Back
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-8">
        <div className="rounded-2xl border border-white/70 bg-white/90 shadow-[0_12px_30px_rgba(31,41,55,0.12)] backdrop-blur p-8">
          <h1 className="text-3xl font-semibold text-zinc-900 mb-8">Request Details</h1>

          <div className="grid gap-8">
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <p className="text-xs uppercase tracking-wide text-zinc-400 font-semibold">Hospital</p>
                <p className="mt-2 text-lg font-semibold text-zinc-900">{request.hospitalName || "-"}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-zinc-400 font-semibold">Patient Name</p>
                <p className="mt-2 text-lg font-semibold text-zinc-900">{request.patientName}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-zinc-400 font-semibold">Blood Type</p>
                <p className="mt-2 text-lg font-semibold text-zinc-900">{request.bloodType}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-zinc-400 font-semibold">Units Required</p>
                <p className="mt-2 text-lg font-semibold text-zinc-900">{request.unitsRequested ?? "-"}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-zinc-400 font-semibold">Status</p>
                <div className="mt-2">
                  <span className={`inline-block rounded-full px-4 py-1 text-sm font-medium ${getStatusBadge(request.status)}`}>
                    {request.status}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-zinc-400 font-semibold">Contact Phone</p>
                <p className="mt-2 text-lg font-semibold text-zinc-900">{request.contactPhone || "-"}</p>
              </div>
            </div>

            <hr className="border-zinc-200" />

            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <p className="text-xs uppercase tracking-wide text-zinc-400 font-semibold">Created At</p>
                <p className="mt-2 text-sm text-zinc-700">{new Date(request.createdAt).toLocaleString()}</p>
              </div>
              {request.neededBy && (
                <div>
                  <p className="text-xs uppercase tracking-wide text-zinc-400 font-semibold">Needed By</p>
                  <p className="mt-2 text-sm text-zinc-700">{new Date(request.neededBy).toLocaleDateString()}</p>
                </div>
              )}
              {request.scheduledAt && (
                <div>
                  <p className="text-xs uppercase tracking-wide text-zinc-400 font-semibold">Scheduled At</p>
                  <p className="mt-2 text-sm text-zinc-700">{new Date(request.scheduledAt).toLocaleString()}</p>
                </div>
              )}
            </div>

            {request.notes && (
              <>
                <hr className="border-zinc-200" />
                <div>
                  <p className="text-xs uppercase tracking-wide text-zinc-400 font-semibold mb-2">Notes</p>
                  <div className="rounded-lg bg-zinc-50 p-4 text-zinc-700">{request.notes}</div>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
