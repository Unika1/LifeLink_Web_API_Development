"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import SectionHeader from "@/app/_components/SectionHeader";
import { checkEligibility } from "@/lib/api/donor/eligibility";
import { getHospitals } from "@/lib/api/hospital/info";
import {
  createOrganRequest,
  getOrganRequestById,
  updateOrganRequest,
} from "@/lib/api/donor/organ-donations";

type OrganRequestFormData = {
  hospitalName: string;
  donorName: string;
  notes?: string;
};

export default function OrganRequestPage() {
  const router = useRouter();
  const apiBaseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5050";
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");
  const viewId = searchParams.get("view");
  const isViewMode = Boolean(viewId);
  const requestId = editId || viewId;
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [reportFile, setReportFile] = useState<File | null>(null);
  const [existingReportUrl, setExistingReportUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [hospitalNames, setHospitalNames] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<OrganRequestFormData>({
    defaultValues: {
      hospitalName: "",
      donorName: "",
      notes: "",
    },
  });

  const getReportUrl = (path?: string | null) => {
    if (!path) return null;
    if (path.startsWith("http")) return path;
    const normalized = path.startsWith("/") ? path : `/${path}`;
    return `${apiBaseUrl}${normalized}`;
  };

  useEffect(() => {
    const ensureEligibility = async () => {
      try {
        setLoading(true);
        
        // Load hospital names from database
        const hospitalsResponse = await getHospitals();
        if (hospitalsResponse.success && hospitalsResponse.data) {
          const names = hospitalsResponse.data.map((h: any) => h.name);
          setHospitalNames(names);
        }
        
        if (!requestId) {
          const eligibility = await checkEligibility();
          if (!eligibility?.data?.eligible) {
            router.push("/eligibility?type=organ");
          }
          return;
        }

        const response = await getOrganRequestById(requestId);
        if (response.success && response.data) {
          reset({
            hospitalName: response.data.hospitalName || "",
            donorName: response.data.donorName || "",
            notes: response.data.notes || "",
          });
          setExistingReportUrl(getReportUrl(response.data.reportUrl) || null);
        } else {
          setError(response.message || "Failed to load organ request");
        }
      } catch (err: any) {
        if (!requestId) {
          router.push("/eligibility?type=organ");
        } else {
          setError(err.message || "Failed to load organ request");
        }
      } finally {
        setLoading(false);
      }
    };

    ensureEligibility();
  }, [router, requestId, reset]);

  const onSubmit = async (values: OrganRequestFormData) => {
    setError("");
    setSuccess("");

    if (!values.hospitalName.trim() || !values.donorName.trim()) {
      setError("Please fill all required fields.");
      return;
    }

    if (!requestId && !reportFile) {
      setError("Health report file is required");
      return;
    }

    try {
      let response;
      if (requestId) {
        if (reportFile) {
          const formData = new FormData();
          formData.append("hospitalName", values.hospitalName);
          formData.append("donorName", values.donorName.trim());
          if (values.notes?.trim()) {
            formData.append("notes", values.notes.trim());
          }
          formData.append("report", reportFile);
          console.log("Updating organ request with file. FormData entries:", {
            hospitalName: values.hospitalName,
            donorName: values.donorName.trim(),
            notes: values.notes?.trim(),
            file: reportFile.name,
            fileSize: reportFile.size,
          });
          response = await updateOrganRequest(requestId, formData);
        } else {
          response = await updateOrganRequest(requestId, {
            hospitalName: values.hospitalName,
            donorName: values.donorName.trim(),
            notes: values.notes?.trim() || undefined,
          });
        }
      } else {
        const formData = new FormData();
        formData.append("hospitalName", values.hospitalName);
        formData.append("donorName", values.donorName.trim());
        if (values.notes?.trim()) {
          formData.append("notes", values.notes.trim());
        }
        formData.append("report", reportFile as File);
        console.log("Creating organ request with file. FormData entries:", {
          hospitalName: values.hospitalName,
          donorName: values.donorName.trim(),
          notes: values.notes?.trim(),
          file: (reportFile as File).name,
          fileSize: (reportFile as File).size,
        });
        response = await createOrganRequest(formData);
        console.log("Organ request creation response:", response);
      }
      if (!response.success) {
        setError(response.message || "Failed to submit organ request");
        console.error("Request failed:", response);
        return;
      }

      console.log("Organ request submitted successfully. Data:", response.data);
      setSuccess(requestId ? "Organ request updated successfully" : "Organ request submitted successfully");
      reset();
      setReportFile(null);
      setTimeout(() => {
        if (requestId) {
          // Force refresh to ensure latest data is shown
          window.location.href = "/dashboard";
        } else {
          router.push("/dashboard");
        }
      }, 800);
    } catch (err: any) {
      console.error("Form submission error:", err);
      setError(err.message || "Failed to submit organ request");
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(1000px_circle_at_top,_#fff1f2,_#f8fafc_60%,_#eef2ff)] px-6 py-10 text-zinc-900">
      <div className="mx-auto max-w-3xl space-y-6">
        <SectionHeader
          eyebrow="Request"
          title={requestId ? "Organ Request" : "Request Organ Donation"}
          subtitle={
            requestId
              ? "Review or update your organ request."
              : "Submit your organ donation request with a medical report."
          }
        />

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="rounded-2xl border border-white/70 bg-white/90 p-8 shadow-xl shadow-slate-200/60 backdrop-blur"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="text-sm font-medium text-zinc-700">Hospital</label>
              <select
                {...register("hospitalName", { required: "This field is required" })}
                disabled={loading || isViewMode}
                className="mt-2 w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 outline-none focus:border-[#d4002a] focus:ring-4 focus:ring-red-100"
              >
                <option value="">Select hospital</option>
                {loading && (
                  <option value="" disabled>
                    Checking eligibility...
                  </option>
                )}
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

            <div className="sm:col-span-2">
              <label className="text-sm font-medium text-zinc-700">Donor Name</label>
              <input
                {...register("donorName", { required: "This field is required" })}
                disabled={isViewMode}
                className="mt-2 w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm text-zinc-900 outline-none focus:border-[#d4002a] focus:ring-4 focus:ring-red-100"
                placeholder="Full name"
              />
              {errors.donorName && (
                <p className="mt-1 text-xs text-red-600">{errors.donorName.message}</p>
              )}
            </div>

            <div className="sm:col-span-2">
              <label className="text-sm font-medium text-zinc-700">Medical Report (PDF or image)</label>
              {existingReportUrl && (
                <div className="mt-2 text-sm">
                  <a
                    href={existingReportUrl}
                    className="text-blue-600 hover:underline"
                    target="_blank"
                    rel="noreferrer"
                  >
                    View current report
                  </a>
                </div>
              )}
              <input
                type="file"
                accept="image/*,application/pdf"
                onChange={(event) => setReportFile(event.target.files?.[0] || null)}
                disabled={isViewMode}
                className="mt-2 w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 outline-none focus:border-[#d4002a] focus:ring-4 focus:ring-red-100"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-sm font-medium text-zinc-700">Notes</label>
              <textarea
                {...register("notes")}
                disabled={isViewMode}
                className="mt-2 min-h-[120px] w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm text-zinc-900 outline-none focus:border-[#d4002a] focus:ring-4 focus:ring-red-100"
                placeholder="Additional notes"
              />
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-3">
            {error && <p className="mr-auto text-sm text-red-600">{error}</p>}
            {success && <p className="mr-auto text-sm text-emerald-600">{success}</p>}
            <button
              type="button"
              onClick={() => router.push("/dashboard")}
              className="btn-secondary"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            {!isViewMode && (
              <button type="submit" className="btn-primary" disabled={isSubmitting}>
                {isSubmitting
                  ? "Submitting..."
                  : requestId
                    ? "Update Request"
                    : "Submit Request"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
