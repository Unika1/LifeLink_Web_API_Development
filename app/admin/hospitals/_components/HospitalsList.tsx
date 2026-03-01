"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { adminDeleteHospital } from "@/lib/api/admin/hospitals";
import { getHospitals } from "@/lib/api/hospital/info";
import { useAdminSearch } from "../../context/AdminContext";

interface Hospital {
  _id: string;
  name: string;
  email: string;
  phoneNumber: string;
  address: {
    city: string;
    state: string;
    street: string;
    zipCode: string;
    country: string;
  };
  createdAt: string;
  isActive: boolean;
}

export default function HospitalsList() {
  const { searchQuery } = useAdminSearch();
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    loadHospitals();
  }, []);

  const loadHospitals = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await getHospitals();
      if (response.success) {
        setHospitals(response.data || []);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load hospitals");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await adminDeleteHospital(id);
      setHospitals(hospitals.filter((hospital) => hospital._id !== id));
      setDeleteConfirm(null);
    } catch (err: any) {
      setError(err.message || "Failed to delete hospital");
    }
  };

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredHospitals = normalizedQuery
    ? hospitals.filter((hospital) =>
        [
          hospital.name,
          hospital.email,
          hospital.phoneNumber,
          hospital.address?.city,
          hospital.address?.state,
          hospital.address?.street,
        ]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(normalizedQuery))
      )
    : hospitals;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-zinc-600">Loading hospitals...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900">Hospitals</h1>
          <p className="mt-1 text-zinc-600">
            Manage hospital accounts and details
          </p>
        </div>
        <Link
          href="/admin/hospitals/create"
          className="rounded-lg bg-[#d4002a] px-6 py-2 font-semibold text-white transition hover:bg-[#b8002a]"
        >
          + Add Hospital
        </Link>
      </div>

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
                  Hospital
                </th>
                <th className="px-6 py-4 text-left font-semibold text-zinc-900">
                  Contact
                </th>
                <th className="px-6 py-4 text-left font-semibold text-zinc-900">
                  Location
                </th>
                <th className="px-6 py-4 text-left font-semibold text-zinc-900">
                  Status
                </th>
                <th className="px-6 py-4 text-right font-semibold text-zinc-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredHospitals.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-zinc-600"
                  >
                    {normalizedQuery ? "No hospitals match this search" : "No hospitals found"}
                  </td>
                </tr>
              ) : (
                filteredHospitals.map((hospital) => {
                  const hospitalId = (hospital as any)._id || (hospital as any).id;
                  return (
                  <tr
                    key={hospitalId || hospital.name}
                    className="border-b border-zinc-100 transition hover:bg-zinc-50"
                  >
                    <td className="px-6 py-4">
                      <div className="font-medium text-zinc-900">
                        {hospital.name}
                      </div>
                      <div className="text-xs text-zinc-500">
                        Added {new Date(hospital.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-zinc-600">
                      <div>{hospital.email}</div>
                      <div className="text-xs text-zinc-500">
                        {hospital.phoneNumber}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-zinc-600">
                      {hospital.address.city}, {hospital.address.state}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={[
                          "rounded-full px-3 py-1 text-xs font-semibold",
                          hospital.isActive
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-zinc-100 text-zinc-600",
                        ].join(" ")}
                      >
                        {hospital.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        {hospitalId ? (
                          <Link
                            href={`/admin/hospitals/${hospitalId}/edit`}
                            className="text-xs font-semibold text-blue-600 hover:underline"
                          >
                            Edit
                          </Link>
                        ) : (
                          <span className="text-xs text-zinc-400">No ID</span>
                        )}
                        <button
                          onClick={() => setDeleteConfirm(hospitalId || null)}
                          className="text-xs font-semibold text-red-600 hover:underline"
                          disabled={!hospitalId}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-xl border border-zinc-200 bg-white p-6">
            <h3 className="text-lg font-semibold text-zinc-900">Delete Hospital?</h3>
            <p className="mt-2 text-zinc-600">
              Are you sure you want to delete this hospital? This action cannot be undone.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 rounded-lg bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700 transition"
              >
                Delete
              </button>
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 rounded-lg border border-zinc-300 px-4 py-2 font-semibold text-zinc-900 hover:bg-zinc-50 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
