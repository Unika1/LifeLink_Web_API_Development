"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import SectionHeader from "@/app/_components/SectionHeader";
import { createRequest } from "@/lib/api/requests";
import { checkEligibility } from "@/lib/api/eligibility";
import { requestSchema, type RequestData } from "./schema";

const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const hospitalNames = [
  "Om Hospital",
  "Norvic International Hospital",
  "Nepal Medicity Hospital",
  "B & B Hospital",
];

export default function RequestPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
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
  }, []);

  const onSubmit = async (values: RequestData) => {
    setError("");
    setSuccess("");

    try {
      const response = await createRequest({
        hospitalName: values.hospitalName,
        patientName: values.patientName.trim(),
        bloodType: values.bloodType,
        unitsRequested: values.unitsRequested,
        contactPhone: values.contactPhone?.trim() || undefined,
        notes: values.notes?.trim() || undefined,
      });

      if (!response.success) {
        setError(response.message || "Failed to submit request");
        return;
      }

      setSuccess("Request submitted successfully");
      reset();
      setTimeout(() => {
        router.push("/dashboard");
      }, 800);
    } catch (err: any) {
      setError(err.message || "Failed to submit request");
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(1000px_circle_at_top,_#fff1f2,_#f8fafc_60%,_#eef2ff)] px-6 py-10 text-zinc-900">
      <div className="mx-auto max-w-3xl space-y-6">
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
                {...register("unitsRequested")}
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
              onClick={() => router.push("/dashboard")}
              className="btn-secondary"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
