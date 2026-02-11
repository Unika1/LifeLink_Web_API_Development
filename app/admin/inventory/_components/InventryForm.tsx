"use client";

import { useEffect, useState } from "react";
import SectionHeader from "@/app/_components/SectionHeader";
import { getHospitals, getHospitalInventory } from "@/lib/api/hospital";

interface Hospital {
  _id: string;
  name: string;
}

interface InventoryItem {
  bloodType: string;
  unitsAvailable: number;
}

export default function AdminInventoryPage() {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [selectedHospitalId, setSelectedHospitalId] = useState<string>("");
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [inventoryLoading, setInventoryLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadHospitals = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await getHospitals();
        if (response.success) {
          const items = response.data || [];
          setHospitals(items);
          if (items.length > 0) {
            setSelectedHospitalId(items[0]._id);
          }
        } else {
          setError(response.message || "Failed to load hospitals");
        }
      } catch (err: any) {
        setError(err.message || "Failed to load hospitals");
      } finally {
        setLoading(false);
      }
    };

    loadHospitals();
  }, []);

  useEffect(() => {
    const loadInventory = async () => {
      if (!selectedHospitalId) {
        setInventory([]);
        return;
      }

      try {
        setInventoryLoading(true);
        setError("");
        const response = await getHospitalInventory(selectedHospitalId);
        if (response.success) {
          setInventory(response.data || []);
        } else {
          setError(response.message || "Failed to load inventory");
        }
      } catch (err: any) {
        setError(err.message || "Failed to load inventory");
      } finally {
        setInventoryLoading(false);
      }
    };

    loadInventory();
  }, [selectedHospitalId]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-zinc-600">Loading inventory...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Admin"
        title="Blood Inventory"
        subtitle="View stock levels by hospital."
      />

      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
          ✕ {error}
        </div>
      )}

      <div className="rounded-xl border border-zinc-200 bg-white p-4">
        <label className="text-sm font-medium text-zinc-700">
          Select Hospital
        </label>
        <select
          value={selectedHospitalId}
          onChange={(event) => setSelectedHospitalId(event.target.value)}
          className="mt-2 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900"
        >
          {hospitals.map((hospital) => (
            <option key={hospital._id} value={hospital._id}>
              {hospital.name}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50">
                <th className="px-6 py-4 text-left font-semibold text-zinc-900">
                  Blood Type
                </th>
                <th className="px-6 py-4 text-left font-semibold text-zinc-900">
                  Units Available
                </th>
              </tr>
            </thead>
            <tbody>
              {inventoryLoading ? (
                <tr>
                  <td colSpan={2} className="px-6 py-10 text-center text-zinc-600">
                    Loading inventory...
                  </td>
                </tr>
              ) : inventory.length === 0 ? (
                <tr>
                  <td colSpan={2} className="px-6 py-10 text-center text-zinc-600">
                    No inventory data
                  </td>
                </tr>
              ) : (
                inventory.map((item) => (
                  <tr key={item.bloodType} className="border-b border-zinc-100">
                    <td className="px-6 py-4 text-zinc-700">
                      {item.bloodType}
                    </td>
                    <td className="px-6 py-4 text-zinc-700">
                      {item.unitsAvailable}
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
