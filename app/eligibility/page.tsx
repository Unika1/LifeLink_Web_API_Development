"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import SectionHeader from "@/app/_components/SectionHeader";
import { checkEligibility, submitEligibilityQuestionnaire } from "@/lib/api/eligibility";

const genders = ["male", "female", "other"] as const;

export default function EligibilityPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestType = searchParams.get("type") === "organ" ? "organ" : "blood";
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    age: "",
    weight: "",
    gender: "",
    noDiseases: false,
    hasBloodPressure: false,
    hasDiabetes: false,
    hasHeartDisease: false,
    hasCancer: false,
    hasHepatitis: false,
    hasHIV: false,
    hasTuberculosis: false,
    recentTravel: false,
    travelCountries: "",
    takingMedications: false,
    medications: "",
    activeInfection: false,
    infectionDetails: "",
    isPregnant: false,
    isBreastfeeding: false,
    hasRecentTattoo: false,
    hasRecentPiercing: false,
    hadBloodTransfusion: false,
    additionalNotes: "",
  });

  const handleChange = (field: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!form.age || !form.weight || !form.gender) {
      setError("This field is required");
      return;
    }

    try {
      setSaving(true);
      await submitEligibilityQuestionnaire({
        age: Number(form.age),
        weight: Number(form.weight),
        gender: form.gender as (typeof genders)[number],
        hasBloodPressure: form.hasBloodPressure,
        hasDiabetes: form.hasDiabetes,
        hasHeartDisease: form.hasHeartDisease,
        hasCancer: form.hasCancer,
        hasHepatitis: form.hasHepatitis,
        hasHIV: form.hasHIV,
        hasTuberculosis: form.hasTuberculosis,
        recentTravel: form.recentTravel,
        travelCountries: form.travelCountries
          ? form.travelCountries.split(",").map((item) => item.trim()).filter(Boolean)
          : undefined,
        takingMedications: form.takingMedications,
        medications: form.medications
          ? form.medications.split(",").map((item) => item.trim()).filter(Boolean)
          : undefined,
        activeInfection: form.activeInfection,
        infectionDetails: form.infectionDetails || undefined,
        isPregnant: form.isPregnant || undefined,
        isBreastfeeding: form.isBreastfeeding || undefined,
        hasRecentTattoo: form.hasRecentTattoo,
        hasRecentPiercing: form.hasRecentPiercing,
        hadBloodTransfusion: form.hadBloodTransfusion,
        additionalNotes: form.additionalNotes || undefined,
      });

      const eligibility = await checkEligibility();
      if (eligibility?.data?.eligible) {
        setSuccess("You are eligible. Redirecting to request form...");
        const targetRoute = requestType === "organ" ? "/request/organ" : "/request";
        setTimeout(() => router.push(targetRoute), 800);
        return;
      }

      setSuccess(eligibility?.message || "Questionnaire submitted.");
    } catch (err: any) {
      setError(err.message || "Failed to submit questionnaire");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(1000px_circle_at_top,_#fff1f2,_#f8fafc_60%,_#eef2ff)] px-6 py-10 text-zinc-900">
      <div className="mx-auto max-w-3xl space-y-6">
        <SectionHeader
          eyebrow="Eligibility"
          title="Eligibility Questionnaire"
          subtitle={
            requestType === "organ"
              ? "Please complete this before requesting organ donation."
              : "Please complete this before requesting blood."
          }
        />

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-white/70 bg-white/90 p-8 shadow-xl shadow-slate-200/60 backdrop-blur"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-zinc-700">Age</label>
              <input
                type="number"
                min={18}
                value={form.age}
                onChange={(event) => handleChange("age", event.target.value)}
                className="mt-2 w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm text-zinc-900 outline-none focus:border-[#d4002a] focus:ring-4 focus:ring-red-100"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-zinc-700">Weight (kg)</label>
              <input
                type="number"
                min={40}
                value={form.weight}
                onChange={(event) => handleChange("weight", event.target.value)}
                className="mt-2 w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm text-zinc-900 outline-none focus:border-[#d4002a] focus:ring-4 focus:ring-red-100"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-sm font-medium text-zinc-700">Gender</label>
              <select
                value={form.gender}
                onChange={(event) => handleChange("gender", event.target.value)}
                className="mt-2 w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 outline-none focus:border-[#d4002a] focus:ring-4 focus:ring-red-100"
              >
                <option value="">Select gender</option>
                {genders.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2">
            <label className="flex items-center gap-2 text-sm text-zinc-700">
              <input
                type="checkbox"
                checked={form.noDiseases}
                onChange={(event) => handleChange("noDiseases", event.target.checked)}
              />
              No diseases
            </label>
            <label className="flex items-center gap-2 text-sm text-zinc-700">
              <input
                type="checkbox"
                checked={form.hasBloodPressure}
                onChange={(event) => handleChange("hasBloodPressure", event.target.checked)}
              />
              High blood pressure
            </label>
            <label className="flex items-center gap-2 text-sm text-zinc-700">
              <input
                type="checkbox"
                checked={form.hasDiabetes}
                onChange={(event) => handleChange("hasDiabetes", event.target.checked)}
              />
              Diabetes
            </label>
            <label className="flex items-center gap-2 text-sm text-zinc-700">
              <input
                type="checkbox"
                checked={form.hasHeartDisease}
                onChange={(event) => handleChange("hasHeartDisease", event.target.checked)}
              />
              Heart disease
            </label>
            <label className="flex items-center gap-2 text-sm text-zinc-700">
              <input
                type="checkbox"
                checked={form.hasCancer}
                onChange={(event) => handleChange("hasCancer", event.target.checked)}
              />
              Cancer
            </label>
            <label className="flex items-center gap-2 text-sm text-zinc-700">
              <input
                type="checkbox"
                checked={form.hasHepatitis}
                onChange={(event) => handleChange("hasHepatitis", event.target.checked)}
              />
              Hepatitis
            </label>
            <label className="flex items-center gap-2 text-sm text-zinc-700">
              <input
                type="checkbox"
                checked={form.hasHIV}
                onChange={(event) => handleChange("hasHIV", event.target.checked)}
              />
              HIV
            </label>
            <label className="flex items-center gap-2 text-sm text-zinc-700">
              <input
                type="checkbox"
                checked={form.hasTuberculosis}
                onChange={(event) => handleChange("hasTuberculosis", event.target.checked)}
              />
              Tuberculosis
            </label>
            <label className="flex items-center gap-2 text-sm text-zinc-700">
              <input
                type="checkbox"
                checked={form.recentTravel}
                onChange={(event) => handleChange("recentTravel", event.target.checked)}
              />
              Recent travel
            </label>
            <label className="flex items-center gap-2 text-sm text-zinc-700">
              <input
                type="checkbox"
                checked={form.takingMedications}
                onChange={(event) => handleChange("takingMedications", event.target.checked)}
              />
              Taking medications
            </label>
            <label className="flex items-center gap-2 text-sm text-zinc-700">
              <input
                type="checkbox"
                checked={form.activeInfection}
                onChange={(event) => handleChange("activeInfection", event.target.checked)}
              />
              Active infection
            </label>
            <label className="flex items-center gap-2 text-sm text-zinc-700">
              <input
                type="checkbox"
                checked={form.isPregnant}
                onChange={(event) => handleChange("isPregnant", event.target.checked)}
              />
              Pregnant
            </label>
            <label className="flex items-center gap-2 text-sm text-zinc-700">
              <input
                type="checkbox"
                checked={form.isBreastfeeding}
                onChange={(event) => handleChange("isBreastfeeding", event.target.checked)}
              />
              Breastfeeding
            </label>
            <label className="flex items-center gap-2 text-sm text-zinc-700">
              <input
                type="checkbox"
                checked={form.hasRecentTattoo}
                onChange={(event) => handleChange("hasRecentTattoo", event.target.checked)}
              />
              Recent tattoo
            </label>
            <label className="flex items-center gap-2 text-sm text-zinc-700">
              <input
                type="checkbox"
                checked={form.hasRecentPiercing}
                onChange={(event) => handleChange("hasRecentPiercing", event.target.checked)}
              />
              Recent piercing
            </label>
            <label className="flex items-center gap-2 text-sm text-zinc-700">
              <input
                type="checkbox"
                checked={form.hadBloodTransfusion}
                onChange={(event) => handleChange("hadBloodTransfusion", event.target.checked)}
              />
              Had blood transfusion
            </label>
          </div>

          {form.recentTravel && (
            <div className="mt-4">
              <label className="text-sm font-medium text-zinc-700">
                Travel countries (comma separated)
              </label>
              <input
                value={form.travelCountries}
                onChange={(event) => handleChange("travelCountries", event.target.value)}
                className="mt-2 w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm text-zinc-900 outline-none focus:border-[#d4002a] focus:ring-4 focus:ring-red-100"
                placeholder="India, Thailand"
              />
            </div>
          )}

          {form.takingMedications && (
            <div className="mt-4">
              <label className="text-sm font-medium text-zinc-700">
                Medications (comma separated)
              </label>
              <input
                value={form.medications}
                onChange={(event) => handleChange("medications", event.target.value)}
                className="mt-2 w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm text-zinc-900 outline-none focus:border-[#d4002a] focus:ring-4 focus:ring-red-100"
                placeholder="Paracetamol"
              />
            </div>
          )}

          {form.activeInfection && (
            <div className="mt-4">
              <label className="text-sm font-medium text-zinc-700">Infection details</label>
              <input
                value={form.infectionDetails}
                onChange={(event) => handleChange("infectionDetails", event.target.value)}
                className="mt-2 w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm text-zinc-900 outline-none focus:border-[#d4002a] focus:ring-4 focus:ring-red-100"
                placeholder="Flu"
              />
            </div>
          )}

          <div className="mt-6">
            <label className="text-sm font-medium text-zinc-700">Additional Notes</label>
            <textarea
              value={form.additionalNotes}
              onChange={(event) => handleChange("additionalNotes", event.target.value)}
              className="mt-2 min-h-[120px] w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm text-zinc-900 outline-none focus:border-[#d4002a] focus:ring-4 focus:ring-red-100"
              placeholder="Anything else to share"
            />
          </div>

          <div className="mt-6 flex items-center justify-end gap-3">
            {error && <p className="mr-auto text-sm text-red-600">{error}</p>}
            {success && <p className="mr-auto text-sm text-emerald-600">{success}</p>}
            <button
              type="button"
              onClick={() => router.push("/dashboard")}
              className="btn-secondary"
              disabled={saving}
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
