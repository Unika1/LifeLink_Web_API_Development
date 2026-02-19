"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import SectionHeader from "@/app/_components/SectionHeader";
import Image from "next/image";

export default function RequestSelectionPage() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<"blood" | "organ" | null>(null);

  const handleContinue = () => {
    if (!selectedType) {
      alert("Please select a donation type");
      return;
    }
    router.push(`/eligibility?type=${selectedType}`);
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(1000px_circle_at_top,_#fff1f2,_#f8fafc_60%,_#eef2ff)] px-6 py-10 text-zinc-900">
      <div className="mx-auto max-w-3xl space-y-6">
        <SectionHeader
          eyebrow="Request"
          title="Select Donation Type"
          subtitle="Choose whether you need blood or organ donation."
        />

        <div className="grid gap-6 sm:grid-cols-2">
          {/* Blood Donation Card */}
          <button
            onClick={() => setSelectedType("blood")}
            className={`group relative overflow-hidden rounded-2xl border-2 p-8 transition-all ${
              selectedType === "blood"
                ? "border-[#d4002a] bg-red-50/50 shadow-lg"
                : "border-white/70 bg-white/90 hover:border-red-200 hover:shadow-md"
            }`}
          >
            <div className="flex flex-col items-center gap-4 text-center">
              <div
                className={`h-20 w-20 rounded-2xl flex items-center justify-center transition-colors ${
                  selectedType === "blood" ? "bg-red-100" : "bg-[#ffe1e6]"
                }`}
              >
                <Image
                  src="/blood-drop.png"
                  alt="Blood donation"
                  width={48}
                  height={48}
                  className="h-12 w-12 object-contain"
                />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-zinc-900">
                  Blood Donation
                </h3>
                <p className="mt-2 text-sm text-zinc-600">
                  Request blood from hospitals and blood banks
                </p>
              </div>
              {selectedType === "blood" && (
                <div className="absolute right-4 top-4 rounded-full bg-[#d4002a] px-2 py-0.5 text-xs font-semibold text-white">
                  Selected
                </div>
              )}
            </div>
          </button>

          {/* Organ Donation Card */}
          <button
            onClick={() => setSelectedType("organ")}
            className={`group relative overflow-hidden rounded-2xl border-2 p-8 transition-all ${
              selectedType === "organ"
                ? "border-[#d4002a] bg-red-50/50 shadow-lg"
                : "border-white/70 bg-white/90 hover:border-red-200 hover:shadow-md"
            }`}
          >
            <div className="flex flex-col items-center gap-4 text-center">
              <div
                className={`h-20 w-20 rounded-2xl flex items-center justify-center text-2xl font-semibold text-[#d4002a] transition-colors ${
                  selectedType === "organ" ? "bg-red-100" : "bg-[#fff1f3]"
                }`}
              >
                OR
              </div>
              <div>
                <h3 className="text-xl font-semibold text-zinc-900">
                  Organ Donation
                </h3>
                <p className="mt-2 text-sm text-zinc-600">
                  Request organs with medical reports
                </p>
              </div>
              {selectedType === "organ" && (
                <div className="absolute right-4 top-4 rounded-full bg-[#d4002a] px-2 py-0.5 text-xs font-semibold text-white">
                  Selected
                </div>
              )}
            </div>
          </button>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleContinue}
            className="btn-primary"
            disabled={!selectedType}
          >
            Continue to Eligibility
          </button>
        </div>
      </div>
    </div>
  );
}
