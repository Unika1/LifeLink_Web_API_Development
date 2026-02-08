"use client";

import { useEffect, useState } from "react";
import { adminGetUsers } from "@/lib/api/user";

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
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
        "rounded-xl border border-zinc-200 bg-white p-6",
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
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(false);
      const response = await adminGetUsers();
      if (response.success) {
        setUsers(response.data || []);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load users");
      setLoading(false);
    }
  };

  const stats = [
    { label: "Total Users", value: users.length, color: "bg-[#3b82f6]" },
    { label: "Admin Users", value: users.filter((u) => u.role === "admin").length, color: "bg-[#60d5c8]" },
    { label: "Regular Users", value: users.filter((u) => u.role === "user").length, color: "bg-[#9cf04e]" },
  ];

  const bloodGroups = [
    { label: "A+", value: 32, color: "bg-[#f17d59]" },
    { label: "O+", value: 24, color: "bg-[#3b82f6]" },
    { label: "B+", value: 38, color: "bg-[#f59e0b]" },
    { label: "AB-", value: 28, color: "bg-[#64748b]" },
    { label: "AB+", value: 34, color: "bg-[#22c55e]" },
  ];

  const alerts = [
    "Blood stock low: O+",
    "Pending request approvals",
  ];

  const recentRequests = users.slice(0, 5).map((user, index) => ({
    id: `U${String(index + 1).padStart(3, "0")}`,
    person: `${user.firstName} ${user.lastName}`,
    email: user.email,
    role: user.role,
    status: user.role === "admin" ? "Active" : "Pending",
    time: new Date(user.createdAt).toLocaleString(),
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-zinc-900">Hospital Dashboard</h2>
      </div>

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
              Requests by Blood Group
            </h3>
          </div>
          <div className="flex h-48 items-end justify-between gap-4">
            {bloodGroups.map((group) => (
              <div key={group.label} className="flex flex-1 flex-col items-center">
                <div
                  className={`w-full rounded-md ${group.color}`}
                  style={{ height: `${group.value * 2.2}px` }}
                />
                <span className="mt-3 text-xs font-medium text-zinc-500">
                  {group.label}
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
          <h3 className="text-sm font-semibold text-zinc-900">Recent Users</h3>
        </div>
        {loading ? (
          <div className="text-center text-zinc-600">Loading users...</div>
        ) : error ? (
          <div className="text-center text-red-600">{error}</div>
        ) : users.length === 0 ? (
          <div className="text-center text-zinc-600">No users found</div>
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
