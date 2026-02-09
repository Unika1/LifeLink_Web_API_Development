"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminCreateHospital } from "@/lib/api/hospital";

export default function AdminCreateHospitalPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "Nepal",
  });

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSaving(true);

    try {
      const response = await adminCreateHospital({
        name: form.name,
        email: form.email,
        phoneNumber: form.phoneNumber,
        address: {
          street: form.street,
          city: form.city,
          state: form.state,
          zipCode: form.zipCode,
          country: form.country,
        },
      });
      if (!response.success) {
        setError(response.message || "Failed to create hospital");
        return;
      }

      router.push("/admin/hospitals");
    } catch (err: any) {
      setError(err.message || "Failed to create hospital");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-zinc-900">Add Hospital</h1>
        <p className="mt-1 text-zinc-600">
          Register a new hospital and assign contact details.
        </p>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
          ✕ {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-xl shadow-zinc-200/60"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="text-sm font-medium text-zinc-700">
              Hospital Name
            </label>
            <input
              value={form.name}
              onChange={(event) => handleChange("name", event.target.value)}
              className="mt-2 w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm text-zinc-900 outline-none focus:border-[#d4002a] focus:ring-4 focus:ring-red-100"
              placeholder="Central Blood Bank"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-zinc-700">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(event) => handleChange("email", event.target.value)}
              className="mt-2 w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm text-zinc-900 outline-none focus:border-[#d4002a] focus:ring-4 focus:ring-red-100"
              placeholder="hospital@lifelink.com"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-zinc-700">Phone</label>
            <input
              value={form.phoneNumber}
              onChange={(event) => handleChange("phoneNumber", event.target.value)}
              className="mt-2 w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm text-zinc-900 outline-none focus:border-[#d4002a] focus:ring-4 focus:ring-red-100"
              placeholder="9800000000"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-zinc-700">Street</label>
            <input
              value={form.street}
              onChange={(event) => handleChange("street", event.target.value)}
              className="mt-2 w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm text-zinc-900 outline-none focus:border-[#d4002a] focus:ring-4 focus:ring-red-100"
              placeholder="New Road"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-zinc-700">City</label>
            <input
              value={form.city}
              onChange={(event) => handleChange("city", event.target.value)}
              className="mt-2 w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm text-zinc-900 outline-none focus:border-[#d4002a] focus:ring-4 focus:ring-red-100"
              placeholder="Kathmandu"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-zinc-700">State</label>
            <input
              value={form.state}
              onChange={(event) => handleChange("state", event.target.value)}
              className="mt-2 w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm text-zinc-900 outline-none focus:border-[#d4002a] focus:ring-4 focus:ring-red-100"
              placeholder="Bagmati"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-zinc-700">Zip Code</label>
            <input
              value={form.zipCode}
              onChange={(event) => handleChange("zipCode", event.target.value)}
              className="mt-2 w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm text-zinc-900 outline-none focus:border-[#d4002a] focus:ring-4 focus:ring-red-100"
              placeholder="44600"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-zinc-700">Country</label>
            <input
              value={form.country}
              onChange={(event) => handleChange("country", event.target.value)}
              className="mt-2 w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm text-zinc-900 outline-none focus:border-[#d4002a] focus:ring-4 focus:ring-red-100"
              placeholder="Nepal"
              required
            />
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => router.push("/admin/hospitals")}
            className="rounded-lg border border-zinc-300 px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50"
            disabled={saving}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-lg bg-[#d4002a] px-6 py-2 text-sm font-semibold text-white hover:bg-[#b8002a]"
            disabled={saving}
          >
            {saving ? "Saving..." : "Create Hospital"}
          </button>
        </div>
      </form>
    </div>
  );
}
