"use client";

import { useEffect, useMemo, useState } from "react";
import Cookies from "js-cookie";
import SectionHeader from "@/app/_components/SectionHeader";
import { handleLogout } from "@/lib/actions/auth-actions";
import {
  getHospitals,
  getHospitalInventory,
  getDonors,
  updateHospitalInventory,
  createHospitalInventory,
  deleteHospitalInventory,
} from "@/lib/api/hospital";
import { getRequests, updateRequest } from "@/lib/api/requests";
import { getLatestEligibilityReport } from "@/lib/api/eligibility";

const hospitalNames = [
  "Om Hospital",
  "Norvic International Hospital",
  "Nepal Medicity Hospital",
  "B & B Hospital",
];

function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={[
        "rounded-2xl border border-white/70 bg-white/90 shadow-[0_12px_30px_rgba(31,41,55,0.12)] backdrop-blur",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}

interface Hospital {
  _id: string;
  name: string;
  email: string;
  phoneNumber: string;
  address: {
    city: string;
    state: string;
  };
}

interface InventoryItem {
  bloodType: string;
  unitsAvailable: number;
}

interface BloodRequest {
  _id: string;
  hospitalName?: string;
  patientName: string;
  bloodType: string;
  unitsRequested?: number;
  status: string;
  createdAt: string;
  requestedBy?: string;
  contactPhone?: string;
  neededBy?: string;
  scheduledAt?: string;
  notes?: string;
}

interface Donor {
  _id: string;
  firstName?: string;
  lastName?: string;
  email: string;
  createdAt: string;
}

export default function HospitalDashboardPage() {
  const [hospital, setHospital] = useState<Hospital | null>(null);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [donors, setDonors] = useState<Donor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedRequest, setSelectedRequest] = useState<BloodRequest | null>(null);
  const [report, setReport] = useState<any>(null);
  const [reportLoading, setReportLoading] = useState(false);
  const [reportError, setReportError] = useState("");
  const [scheduleInput, setScheduleInput] = useState("");
  const [scheduleError, setScheduleError] = useState("");
  const [selectedHospitalName, setSelectedHospitalName] = useState(
    hospitalNames[0] || ""
  );
  const [inventoryEdits, setInventoryEdits] = useState<Record<string, number>>(
    {}
  );
  const [inventorySaving, setInventorySaving] = useState<Record<string, boolean>>(
    {}
  );
  const [inventoryDeleting, setInventoryDeleting] = useState<Record<string, boolean>>(
    {}
  );
  const [inventoryMessage, setInventoryMessage] = useState("");
  const [newBloodType, setNewBloodType] = useState("");
  const [newUnits, setNewUnits] = useState(0);

  const alerts = useMemo(() => {
    if (!inventory.length) {
      return ["No inventory data yet"];
    }
    const lowStock = inventory.filter((item) => item.unitsAvailable < 5);
    if (!lowStock.length) {
      return ["All blood groups are sufficiently stocked"];
    }
    return lowStock.map(
      (item) => `Low stock for ${item.bloodType} (${item.unitsAvailable} units)`
    );
  }, [inventory]);

  useEffect(() => {
    loadHospital();
  }, []);

  useEffect(() => {
    if (!selectedHospitalName) {
      return;
    }

    const loadRequestsByName = async () => {
      try {
        const response = await getRequests({ hospitalName: selectedHospitalName });
        if (response.success) {
          setRequests(response.data || []);
        }
      } catch (err: any) {
        setError(err.message || "Failed to load requests");
      }
    };

    loadRequestsByName();
  }, [selectedHospitalName]);

  const loadHospital = async () => {
    try {
      setLoading(true);
      setError("");
      const userDataStr = Cookies.get("lifelink_user");
      const user = userDataStr ? JSON.parse(userDataStr) : null;

      const hospitalsResponse = await getHospitals();
      if (!hospitalsResponse.success) {
        setError(hospitalsResponse.message || "Failed to load hospital data");
        return;
      }

      const hospitals: Hospital[] = hospitalsResponse.data || [];
      const matchedHospital = user?.email
        ? hospitals.find((item) => item.email === user.email)
        : hospitals[0];

      if (!matchedHospital) {
        setHospital(null);
        return;
      }

      setHospital(matchedHospital);

      if (matchedHospital) {
        if (hospitalNames.includes(matchedHospital.name)) {
          setSelectedHospitalName(matchedHospital.name);
        }

        const [inventoryResponse, donorsResponse] = await Promise.all([
          getHospitalInventory(matchedHospital._id),
          getDonors(),
        ]);

        if (inventoryResponse.success) {
          setInventory(inventoryResponse.data || []);
        }

        if (donorsResponse.success) {
          setDonors(donorsResponse.data || []);
        }
      }
    } catch (err: any) {
      setError(err.message || "Failed to load hospital dashboard");
    } finally {
      setLoading(false);
    }
  };

  const totalUnits = inventory.reduce((sum, item) => sum + item.unitsAvailable, 0);
  const lowStockCount = inventory.filter((item) => item.unitsAvailable < 5).length;

  const handleInventoryChange = (bloodType: string, value: string) => {
    const numericValue = Number(value);
    setInventoryEdits((prev) => ({
      ...prev,
      [bloodType]: Number.isNaN(numericValue) ? 0 : Math.max(0, numericValue),
    }));
  };

  const handleInventorySave = async (bloodType: string) => {
    if (!hospital?._id) {
      setInventoryMessage("Hospital profile not found for updates.");
      return;
    }

    const unitsAvailable = inventoryEdits[bloodType];
    setInventoryMessage("");
    setInventorySaving((prev) => ({ ...prev, [bloodType]: true }));

    try {
      const response = await updateHospitalInventory(hospital._id, {
        bloodType,
        unitsAvailable,
      });
      if (response.success) {
        setInventory((prev) =>
          prev.map((item) =>
            item.bloodType === bloodType
              ? { ...item, unitsAvailable }
              : item
          )
        );
        setInventoryMessage("Inventory updated.");
      }
    } catch (err: any) {
      setInventoryMessage(err.message || "Failed to update inventory");
    } finally {
      setInventorySaving((prev) => ({ ...prev, [bloodType]: false }));
    }
  };

  const handleInventoryCreate = async () => {
    if (!hospital?._id) {
      setInventoryMessage("Hospital profile not found for updates.");
      return;
    }

    if (!newBloodType.trim()) {
      setInventoryMessage("Please enter a blood type name.");
      return;
    }

    setInventoryMessage("");

    try {
      const response = await createHospitalInventory(hospital._id, {
        bloodType: newBloodType.trim(),
        unitsAvailable: Number(newUnits) || 0,
      });

      if (response.success) {
        setInventory((prev) => [
          ...prev,
          { bloodType: newBloodType.trim(), unitsAvailable: Number(newUnits) || 0 },
        ]);
        setNewBloodType("");
        setNewUnits(0);
        setInventoryMessage("Blood type added.");
      }
    } catch (err: any) {
      setInventoryMessage(err.message || "Failed to add blood type");
    }
  };

  const handleInventoryDelete = async (bloodType: string) => {
    if (!hospital?._id) {
      setInventoryMessage("Hospital profile not found for updates.");
      return;
    }

    setInventoryMessage("");
    setInventoryDeleting((prev) => ({ ...prev, [bloodType]: true }));

    try {
      const response = await deleteHospitalInventory(hospital._id, bloodType);
      if (response.success) {
        setInventory((prev) =>
          prev.filter((item) => item.bloodType !== bloodType)
        );
        setInventoryMessage("Blood type removed.");
      }
    } catch (err: any) {
      setInventoryMessage(err.message || "Failed to delete blood type");
    } finally {
      setInventoryDeleting((prev) => ({ ...prev, [bloodType]: false }));
    }
  };

  const handleStatusUpdate = async (requestId: string, status: string) => {
    try {
      const response = await updateRequest(requestId, { status });
      if (response.success) {
        setRequests((prev) =>
          prev.map((item) =>
            item._id === requestId ? { ...item, status } : item
          )
        );
      }
    } catch (err: any) {
      setError(err.message || "Failed to update request");
    }
  };

  const handleSelectRequest = async (request: BloodRequest) => {
    setSelectedRequest(request);
    setReport(null);
    setReportError("");
    setScheduleError("");
    setScheduleInput(
      request.scheduledAt
        ? new Date(request.scheduledAt).toISOString().slice(0, 16)
        : ""
    );

    if (!request.requestedBy) {
      return;
    }

    try {
      setReportLoading(true);
      const response = await getLatestEligibilityReport(request.requestedBy);
      if (response.success) {
        setReport(response.data);
      } else {
        setReportError(response.message || "No report found");
      }
    } catch (err: any) {
      setReportError(err.message || "Failed to load report");
    } finally {
      setReportLoading(false);
    }
  };

  const handleApproveWithSchedule = async () => {
    if (!selectedRequest) {
      return;
    }

    if (!scheduleInput) {
      setScheduleError("Please set the donation time.");
      return;
    }

    try {
      const response = await updateRequest(selectedRequest._id, {
        status: "approved",
        scheduledAt: new Date(scheduleInput).toISOString(),
      });

      if (response.success) {
        setRequests((prev) =>
          prev.map((item) =>
            item._id === selectedRequest._id
              ? { ...item, status: "approved", scheduledAt: scheduleInput }
              : item
          )
        );
        setScheduleError("");
      }
    } catch (err: any) {
      setScheduleError(err.message || "Failed to schedule request");
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
    <div className="min-h-screen bg-[radial-gradient(1200px_circle_at_top,_#eef2ff,_#fff1f2_45%,_#f8fafc_70%)] text-zinc-900">
      <header className="border-b border-white/70 bg-white/70 backdrop-blur">
        <div className="mx-auto max-w-6xl px-6 py-6">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#d4002a]">
                Hospital Console
              </p>
              <h1 className="mt-2 text-3xl font-semibold text-zinc-900">
                {hospital?.name || "Hospital Dashboard"}
              </h1>
              <p className="mt-1 text-sm text-zinc-500">
                {hospital
                  ? `${hospital.address.city}, ${hospital.address.state} • ${hospital.email}`
                  : "Monitor inventory, donor readiness, and live requests"}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="rounded-full border border-white/70 bg-white/80 px-4 py-2 text-xs font-semibold text-zinc-600">
                Active Hospital
              </div>
              <select
                value={selectedHospitalName}
                onChange={(event) => setSelectedHospitalName(event.target.value)}
                className="rounded-xl border border-white/70 bg-white/90 px-4 py-2 text-sm text-zinc-700 shadow-sm"
              >
                {hospitalNames.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
              <form action={handleLogout}>
                <button type="submit" className="btn-secondary">
                  Logout
                </button>
              </form>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-8 px-6 py-10">
        {loading && (
          <Card className="p-6 text-sm text-zinc-600">
            Loading hospital dashboard...
          </Card>
        )}
        {error && <Card className="p-6 text-sm text-red-600">{error}</Card>}

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Active Requests", value: requests.length, accent: "bg-rose-50" },
            { label: "Total Donors", value: donors.length, accent: "bg-sky-50" },
            { label: "Units Available", value: totalUnits, accent: "bg-emerald-50" },
            { label: "Low Stock Alerts", value: lowStockCount, accent: "bg-amber-50" },
          ].map((stat) => (
            <Card key={stat.label} className="p-5">
              <div
                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold text-zinc-600 ${stat.accent}`}
              >
                {stat.label}
              </div>
              <p className="mt-3 text-2xl font-semibold text-zinc-900">
                {stat.value}
              </p>
            </Card>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.75fr_1.25fr]">
          <aside className="space-y-6 lg:sticky lg:top-24 self-start">
            <Card className="p-6">
              <SectionHeader
                eyebrow="Profile"
                title="Hospital Overview"
                subtitle="Key contact information and current focus."
              />
              <div className="mt-4 space-y-2 text-sm text-zinc-600">
                <div className="font-semibold text-zinc-900">
                  {hospital?.name || "Hospital"}
                </div>
                <div>{hospital?.email || ""}</div>
                <div>
                  {hospital
                    ? `${hospital.address.city}, ${hospital.address.state}`
                    : ""}
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <SectionHeader
                eyebrow="Inventory"
                title="Blood Units"
                subtitle="Live stock status by group."
              />
              <div className="mt-4 space-y-3">
                <div className="grid gap-2 sm:grid-cols-[1.2fr_0.8fr_auto]">
                  <input
                    value={newBloodType}
                    onChange={(event) => setNewBloodType(event.target.value)}
                    className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900"
                    placeholder="Blood type name (e.g. O+)"
                  />
                  <input
                    type="number"
                    min={0}
                    value={newUnits}
                    onChange={(event) => setNewUnits(Number(event.target.value))}
                    className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900"
                    placeholder="Units"
                  />
                  <button type="button" className="btn-primary px-4 py-2" onClick={handleInventoryCreate}>
                    Add
                  </button>
                </div>
              </div>
              <div className="mt-4 grid gap-3">
                {inventory.length === 0 ? (
                  <div className="text-sm text-zinc-500">No inventory data</div>
                ) : (
                  inventory.map((item) => (
                    <div
                      key={item.bloodType}
                      className={[
                        "flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-white px-4 py-3",
                        item.unitsAvailable < 5
                          ? "border-amber-200 bg-amber-50"
                          : "border-zinc-200",
                      ].join(" ")}
                    >
                      <span className="text-sm font-medium text-zinc-700">
                        {item.bloodType}
                      </span>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min={0}
                          value={
                            inventoryEdits[item.bloodType] ?? item.unitsAvailable
                          }
                          onChange={(event) =>
                            handleInventoryChange(
                              item.bloodType,
                              event.target.value
                            )
                          }
                          className="w-20 rounded-lg border border-zinc-300 px-2 py-1 text-sm text-zinc-900"
                        />
                        <button
                          type="button"
                          onClick={() => handleInventorySave(item.bloodType)}
                          disabled={inventorySaving[item.bloodType]}
                          className="btn-secondary px-3 py-1 text-xs"
                        >
                          {inventorySaving[item.bloodType] ? "Saving" : "Save"}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleInventoryDelete(item.bloodType)}
                          disabled={inventoryDeleting[item.bloodType]}
                          className="btn-ghost text-xs text-red-600"
                        >
                          {inventoryDeleting[item.bloodType] ? "Deleting" : "Delete"}
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
              {inventoryMessage && (
                <p className="mt-3 text-xs text-zinc-500">{inventoryMessage}</p>
              )}
            </Card>

            <Card className="p-6">
              <SectionHeader
                eyebrow="Alerts"
                title="System Signals"
                subtitle="Low stock and attention items."
              />
              <div className="mt-4 space-y-3">
                {alerts.map((alert) => (
                  <div
                    key={alert}
                    className="rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-700"
                  >
                    {alert}
                  </div>
                ))}
              </div>
            </Card>
          </aside>

          <div className="space-y-6">
            <Card className="p-6">
              <SectionHeader
                eyebrow="Operations"
                title="Donation Requests"
                subtitle={`Showing requests for ${selectedHospitalName}`}
              />
              {requests.length === 0 ? (
                <div className="mt-4 rounded-xl border border-zinc-100 bg-white p-4 text-sm text-zinc-500">
                  No request data yet for {selectedHospitalName || "selected hospital"}
                </div>
              ) : (
                <div className="mt-4 overflow-hidden rounded-xl border border-zinc-100 bg-white">
                  <table className="w-full text-sm">
                    <thead className="bg-zinc-50 text-left text-xs uppercase text-zinc-500">
                      <tr>
                        <th className="px-4 py-3 font-medium">Requester</th>
                        <th className="px-4 py-3 font-medium">Blood</th>
                        <th className="px-4 py-3 font-medium">Units</th>
                        <th className="px-4 py-3 font-medium">Status</th>
                        <th className="px-4 py-3 font-medium">Date</th>
                        <th className="px-4 py-3 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                      {requests.slice(0, 8).map((request) => (
                        <tr key={request._id}>
                          <td className="px-4 py-3 text-zinc-700">
                            {request.patientName}
                          </td>
                          <td className="px-4 py-3 text-zinc-700">
                            {request.bloodType}
                          </td>
                          <td className="px-4 py-3 text-zinc-700">
                            {request.unitsRequested ?? "-"}
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
                                onClick={() => handleSelectRequest(request)}
                                className="btn-ghost text-xs"
                              >
                                Details
                              </button>
                              <button
                                type="button"
                                onClick={() => handleStatusUpdate(request._id, "rejected")}
                                disabled={request.status !== "pending"}
                                className="btn-ghost text-xs text-red-600 disabled:opacity-40"
                              >
                                Reject
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>

            <Card className="p-6">
              <SectionHeader
                eyebrow="Review"
                title="Request Details"
                subtitle="Eligibility history, notes, and scheduling."
              />
              {!selectedRequest ? (
                <div className="mt-4 rounded-xl border border-zinc-100 bg-white p-4 text-sm text-zinc-500">
                  Select a request to view donor history and notes.
                </div>
              ) : (
                <div className="mt-4 space-y-4 text-sm text-zinc-600">
                  <div>
                    <span className="text-xs uppercase tracking-wide text-zinc-400">Requester</span>
                    <div className="font-semibold text-zinc-900">
                      {selectedRequest.patientName}
                    </div>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <span className="text-xs uppercase tracking-wide text-zinc-400">Blood Type</span>
                      <div className="font-semibold text-zinc-900">
                        {selectedRequest.bloodType}
                      </div>
                    </div>
                    <div>
                      <span className="text-xs uppercase tracking-wide text-zinc-400">Units</span>
                      <div className="font-semibold text-zinc-900">
                        {selectedRequest.unitsRequested ?? "-"}
                      </div>
                    </div>
                    <div>
                      <span className="text-xs uppercase tracking-wide text-zinc-400">Contact</span>
                      <div className="font-semibold text-zinc-900">
                        {selectedRequest.contactPhone || "-"}
                      </div>
                    </div>
                    <div>
                      <span className="text-xs uppercase tracking-wide text-zinc-400">Needed By</span>
                      <div className="font-semibold text-zinc-900">
                        {selectedRequest.neededBy
                          ? new Date(selectedRequest.neededBy).toLocaleDateString()
                          : "-"}
                      </div>
                    </div>
                  </div>
                  <div className="rounded-lg border border-zinc-200 bg-white p-4">
                    <div className="text-xs uppercase tracking-wide text-zinc-400">
                      Donation Time
                    </div>
                    <div className="mt-2">
                      <input
                        type="datetime-local"
                        value={scheduleInput}
                        onChange={(event) => setScheduleInput(event.target.value)}
                        className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900"
                      />
                    </div>
                    {scheduleError && (
                      <p className="mt-2 text-xs text-red-600">{scheduleError}</p>
                    )}
                    <div className="mt-3 flex items-center gap-3">
                      <button
                        type="button"
                        onClick={handleApproveWithSchedule}
                        disabled={selectedRequest.status !== "pending"}
                        className="btn-primary bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200/60 disabled:opacity-40"
                      >
                        Approve & Schedule
                      </button>
                      {selectedRequest.scheduledAt && (
                        <span className="text-xs text-zinc-500">
                          Scheduled for {new Date(selectedRequest.scheduledAt).toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                  <div>
                    <span className="text-xs uppercase tracking-wide text-zinc-400">Notes</span>
                    <div className="mt-1 rounded-lg bg-zinc-50 px-3 py-2 text-zinc-700">
                      {selectedRequest.notes || "No notes"}
                    </div>
                  </div>

                  <div>
                    <span className="text-xs uppercase tracking-wide text-zinc-400">Eligibility Report</span>
                    <div className="mt-2 rounded-lg border border-zinc-100 bg-white p-3">
                      {reportLoading && (
                        <div className="text-xs text-zinc-500">Loading report...</div>
                      )}
                      {!reportLoading && reportError && (
                        <div className="text-xs text-red-600">{reportError}</div>
                      )}
                      {!reportLoading && !reportError && report && (
                        <div className="space-y-1 text-xs text-zinc-600">
                          <div>Age: {report.age}</div>
                          <div>Weight: {report.weight} kg</div>
                          <div>Gender: {report.gender}</div>
                          <div>Total Donations: {report.totalDonationsCount ?? 0}</div>
                        </div>
                      )}
                      {!reportLoading && !reportError && !report && (
                        <div className="text-xs text-zinc-500">No report available</div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
}
