"use client";

import { useEffect, useState } from "react";
import SectionHeader from "@/app/_components/SectionHeader";
import { useAdminSearch } from "./context/AdminContext";
import { serverAdminGetUsers } from "@/lib/actions/admin/user-actions";
import { serverGetHospitals } from "@/lib/actions/admin/hospital-actions";
import { serverGetRequests } from "@/lib/actions/admin/request-actions";

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  createdAt: string;
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
  createdAt: string;
}

interface BloodRequest {
  _id: string;
  bloodType: string;
  status: string;
  createdAt: string;
}

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
        "rounded-2xl border border-white/70 bg-white/90 p-6 shadow-[0_12px_30px_rgba(31,41,55,0.12)] backdrop-blur",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: string | number;
  color: string;
}) {
  return (
    <div className={`rounded-2xl p-5 text-white ${color}`}>
      <p className="text-sm/relaxed opacity-90">{label}</p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
    </div>
  );
}

export default function AdminDashboard() {
  const { searchQuery } = useAdminSearch();
  const [users, setUsers] = useState<User[]>([]);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadUsers();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError("");
      const [usersResponse, hospitalsResponse, requestsResponse] = await Promise.all([
        serverAdminGetUsers(),
        serverGetHospitals(),
        serverGetRequests(),
      ]);

      // Handle users response - API returns { success, data: [...] }, server action wraps it
      if (usersResponse?.success) {
        const apiData = usersResponse.data;
        // API response might be { success: true, data: [...] } or just [...]
        const usersArray = apiData?.success && apiData?.data 
          ? apiData.data 
          : Array.isArray(apiData) 
            ? apiData 
            : [];
        setUsers(usersArray);
      }

      // Handle hospitals response
      if (hospitalsResponse?.success) {
        const apiData = hospitalsResponse.data;
        const hospitalsArray = apiData?.success && apiData?.data 
          ? apiData.data 
          : Array.isArray(apiData) 
            ? apiData 
            : [];
        setHospitals(hospitalsArray);
      }

      // Handle requests response
      if (requestsResponse?.success) {
        const apiData = requestsResponse.data;
        const requestsArray = apiData?.success && apiData?.data 
          ? apiData.data 
          : Array.isArray(apiData) 
            ? apiData 
            : [];
        setRequests(requestsArray);
      }
    } catch (err: any) {
      console.error("Error loading dashboard data:", err);
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { label: "Total Users", value: users.length, color: "bg-[#3b82f6]" },
    { label: "Donors", value: users.filter((u) => u.role === "donor").length, color: "bg-[#22c55e]" },
    { label: "Hospitals", value: hospitals.length, color: "bg-[#f59e0b]" },
  ];

  const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  const bloodTypeCounts = bloodTypes.map((type) => ({
    label: type,
    value: requests.filter((request) => request.bloodType === type).length,
  }));

  // Filter users based on search query
  const getFilteredUsers = () => {
    if (!searchQuery.trim()) return users;
    
    const query = searchQuery.toLowerCase();
    return users.filter(
      (user) =>
        user.firstName.toLowerCase().includes(query) ||
        user.lastName.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.role.toLowerCase().includes(query)
    );
  };
  const filteredUsers = getFilteredUsers();

  // Filter hospitals based on search query
  const getFilteredHospitals = () => {
    if (!searchQuery.trim()) return hospitals;
    
    const query = searchQuery.toLowerCase();
    return hospitals.filter(
      (hospital) =>
        hospital.name.toLowerCase().includes(query) ||
        hospital.email.toLowerCase().includes(query) ||
        hospital.address?.city?.toLowerCase().includes(query) ||
        hospital.address?.state?.toLowerCase().includes(query)
    );
  };
  const filteredHospitals = getFilteredHospitals();

  // Filter requests based on search query
  const getFilteredRequests = () => {
    if (!searchQuery.trim()) return requests;
    
    const query = searchQuery.toLowerCase();
    return requests.filter(
      (request) =>
        request.bloodType.toLowerCase().includes(query) ||
        request.status.toLowerCase().includes(query)
    );
  };
  const filteredRequests = getFilteredRequests();

  const maxCount = Math.max(...bloodTypeCounts.map((item) => item.value), 1);
  const bloodGroups = bloodTypeCounts.map((item, index) => ({
    ...item,
    color: ["bg-[#f17d59]", "bg-[#3b82f6]", "bg-[#f59e0b]", "bg-[#64748b]", "bg-[#22c55e]"][
      index % 5
    ],
    height: Math.round((item.value / maxCount) * 120) + 30,
  }));

  const pendingRequests = requests.filter((request) => request.status === "pending").length;
  const alerts = [
    pendingRequests > 0
      ? `${pendingRequests} pending request approvals`
      : "No pending request approvals",
  ];

  const recentRequests = filteredUsers.slice(0, 5).map((user, index) => ({
    id: `U${String(index + 1).padStart(3, "0")}`,
    person: `${user.firstName} ${user.lastName}`,
    email: user.email,
    role: user.role,
    status: "Active",
    time: new Date(user.createdAt).toLocaleString(),
  }));

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Admin"
        title="Overview"
        subtitle="Track users, hospitals, and platform health at a glance."
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map((stat) => (
          <StatCard
            key={stat.label + stat.color}
            label={stat.label}
            value={stat.value}
            color={stat.color}
          />
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-zinc-900">
              Request Distribution by Blood Group
            </h3>
          </div>
          <div className="flex h-48 items-end justify-between gap-4">
            {bloodGroups.map((group) => (
              <div key={group.label} className="flex flex-1 flex-col items-center">
                <div
                  className={`w-full rounded-md ${group.color}`}
                  style={{ height: `${group.height}px` }}
                />
                <span className="mt-3 text-xs font-medium text-zinc-500">
                  {group.label} ({group.value})
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-zinc-900">System Alerts</h3>
          </div>
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div
                key={alert}
                className="rounded-lg bg-zinc-100 px-4 py-3 text-sm text-zinc-700"
              >
                {alert}
              </div>
            ))}
          </div>
        </Card>
      </section>

      <Card>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-zinc-900">Recent Users</h3>
            {searchQuery && (
              <p className="mt-1 text-xs text-zinc-500">
                Found {filteredUsers.length} user(s) matching &quot;{searchQuery}&quot;
              </p>
            )}
          </div>
        </div>
        {loading ? (
          <div className="text-center text-zinc-600">Loading users...</div>
        ) : error ? (
          <div className="text-center text-red-600">{error}</div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center text-zinc-600">
            {searchQuery ? "No users match your search" : "No users found"}
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-zinc-100">
            <table className="w-full text-sm">
              <thead className="bg-zinc-50 text-left text-xs uppercase text-zinc-500">
                <tr>
                  <th className="px-4 py-3 font-medium">ID</th>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Role</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {recentRequests.map((request) => (
                  <tr key={request.id}>
                    <td className="px-4 py-3 text-zinc-700">{request.id}</td>
                    <td className="px-4 py-3 text-zinc-700">
                      {request.person}
                    </td>
                    <td className="px-4 py-3 text-zinc-700">
                      {request.email}
                    </td>
                    <td className="px-4 py-3 text-zinc-700 capitalize">
                      {request.role}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={[
                          "rounded-full px-3 py-1 text-xs font-medium",
                          request.status === "Active"
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-orange-50 text-orange-600",
                        ].join(" ")}
                      >
                        {request.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-zinc-500">{request.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
