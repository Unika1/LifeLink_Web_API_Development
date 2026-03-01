"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { adminUpdateHospital } from "@/lib/api/admin/hospitals";
import { getHospitalById } from "@/lib/api/hospital/info";
import { hospitalUpdateSchema } from "../../../schema";


interface HospitalFormState {
  name: string;
  email: string;
  phoneNumber: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isActive: boolean;
}

export default function EditHospitalForm({ hospitalId }: { hospitalId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [invalidId, setInvalidId] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState<HospitalFormState>({
    name: "",
    email: "",
    phoneNumber: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "Nepal",
    isActive: true,
  });

  useEffect(() => {
    if (!hospitalId || hospitalId === "undefined") {
      setError("Invalid hospital ID. Please go back and select a hospital.");
      setInvalidId(true);
      setLoading(false);
      return;
    }

    const loadHospital = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await getHospitalById(hospitalId);
        if (response.success && response.data) {
          const hospital = response.data;
          setForm({
            name: hospital.name || "",
            email: hospital.email || "",
            phoneNumber: hospital.phoneNumber || "",
            street: hospital.address?.street || "",
            city: hospital.address?.city || "",
            state: hospital.address?.state || "",
            zipCode: hospital.address?.zipCode || "",
            country: hospital.address?.country || "Nepal",
            isActive: hospital.isActive ?? true,
          });
        } else {
          setError(response.message || "Failed to load hospital");
        }
      } catch (err: any) {
        setError(err.message || "Failed to load hospital");
      } finally {
        setLoading(false);
      }
    };

    loadHospital();
  }, [hospitalId]);

  const handleChange = (field: keyof HospitalFormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setFieldErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setFieldErrors({});
    setSaving(true);

    try {
      const parsed = hospitalUpdateSchema.safeParse(form);
      if (!parsed.success) {
        const nextErrors: Record<string, string> = {};
        parsed.error.issues.forEach((issue) => {
          const key = String(issue.path[issue.path.length - 1] || "form");
          if (!nextErrors[key]) {
            nextErrors[key] = issue.message;
          }
        });
        setFieldErrors(nextErrors);
        setError("Please fix the highlighted fields.");
        setSaving(false);
        return;
      }

      const response = await adminUpdateHospital(hospitalId, {
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
        isActive: form.isActive,
      });

      if (!response.success) {
        setError(response.message || "Failed to update hospital");
        return;
      }

      router.push("/admin/hospitals");
    } catch (err: any) {
      setError(err.message || "Failed to update hospital");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-zinc-600">Loading hospital...</div>
      </div>
    );
  }

  if (invalidId) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        {error}
        <button
          type="button"
          onClick={() => router.push("/admin/hospitals")}
          className="ml-3 rounded-md bg-red-600 px-3 py-1 text-white"
        >
          Back to hospitals
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-zinc-900">Edit Hospital</h1>
        <p className="mt-1 text-zinc-600">
          Update hospital contact details and status.
        </p>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
          ✕ {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        noValidate
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
            />
            {fieldErrors.name && (
              <p className="mt-1 text-xs text-red-600">{fieldErrors.name}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-zinc-700">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(event) => handleChange("email", event.target.value)}
              className="mt-2 w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm text-zinc-900 outline-none focus:border-[#d4002a] focus:ring-4 focus:ring-red-100"
              placeholder="hospital@lifelink.com"
            />
            {fieldErrors.email && (
              <p className="mt-1 text-xs text-red-600">{fieldErrors.email}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-zinc-700">Phone</label>
            <input
              value={form.phoneNumber}
              onChange={(event) => handleChange("phoneNumber", event.target.value)}
              className="mt-2 w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm text-zinc-900 outline-none focus:border-[#d4002a] focus:ring-4 focus:ring-red-100"
              placeholder="9800000000"
            />
            {fieldErrors.phoneNumber && (
              <p className="mt-1 text-xs text-red-600">
                {fieldErrors.phoneNumber}
              </p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-zinc-700">Street</label>
            <input
              value={form.street}
              onChange={(event) => handleChange("street", event.target.value)}
              className="mt-2 w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm text-zinc-900 outline-none focus:border-[#d4002a] focus:ring-4 focus:ring-red-100"
              placeholder="New Road"
            />
            {fieldErrors.street && (
              <p className="mt-1 text-xs text-red-600">{fieldErrors.street}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-zinc-700">City</label>
            <input
              value={form.city}
              onChange={(event) => handleChange("city", event.target.value)}
              className="mt-2 w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm text-zinc-900 outline-none focus:border-[#d4002a] focus:ring-4 focus:ring-red-100"
              placeholder="Kathmandu"
            />
            {fieldErrors.city && (
              <p className="mt-1 text-xs text-red-600">{fieldErrors.city}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-zinc-700">State</label>
            <input
              value={form.state}
              onChange={(event) => handleChange("state", event.target.value)}
              className="mt-2 w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm text-zinc-900 outline-none focus:border-[#d4002a] focus:ring-4 focus:ring-red-100"
              placeholder="Bagmati"
            />
            {fieldErrors.state && (
              <p className="mt-1 text-xs text-red-600">{fieldErrors.state}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-zinc-700">Zip Code</label>
            <input
              value={form.zipCode}
              onChange={(event) => handleChange("zipCode", event.target.value)}
              className="mt-2 w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm text-zinc-900 outline-none focus:border-[#d4002a] focus:ring-4 focus:ring-red-100"
              placeholder="44600"
            />
            {fieldErrors.zipCode && (
              <p className="mt-1 text-xs text-red-600">{fieldErrors.zipCode}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-zinc-700">Country</label>
            <input
              value={form.country}
              onChange={(event) => handleChange("country", event.target.value)}
              className="mt-2 w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm text-zinc-900 outline-none focus:border-[#d4002a] focus:ring-4 focus:ring-red-100"
              placeholder="Nepal"
            />
            {fieldErrors.country && (
              <p className="mt-1 text-xs text-red-600">{fieldErrors.country}</p>
            )}
          </div>

          <div className="sm:col-span-2">
            <label className="flex items-center gap-3 text-sm font-medium text-zinc-700">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, isActive: event.target.checked }))
                }
                className="h-4 w-4 rounded border-zinc-300 text-[#d4002a]"
              />
              Active hospital
            </label>
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
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
