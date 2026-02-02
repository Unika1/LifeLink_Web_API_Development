"use client";

import { useState } from "react";

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
  icon,
  color,
}: {
  label: string;
  value: string | number;
  icon: string;
  color: string;
}) {
  return (
    <Card>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-zinc-600">{label}</p>
          <p className="mt-2 text-3xl font-bold text-zinc-900">{value}</p>
        </div>
        <div className={`rounded-lg p-3 text-2xl ${color}`}>{icon}</div>
      </div>
    </Card>
  );
}

export default function AdminDashboard() {
  // TODO: Fetch data from backend API
  // const { data: stats } = useQuery('/api/admin/stats');
  // const { data: bloodInventory } = useQuery('/api/admin/blood-inventory');
  // const { data: recentRequests } = useQuery('/api/admin/requests');

  return (
    <div className="space-y-6">
      {/* Dashboard Header */}
      <div className="border-b border-zinc-200 pb-4">
        <h2 className="text-3xl font-bold text-zinc-900">Admin Dashboard</h2>
        <p className="mt-1 text-sm text-zinc-600">Blood Bank & Donation Management System</p>
      </div>

      {/* Placeholder - Connect to Backend */}
      <Card>
        <div className="py-16 text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-blue-50">
            <span className="text-4xl">🔌</span>
          </div>
          <h3 className="text-xl font-semibold text-zinc-900">Connect to Backend API</h3>
          <p className="mt-2 text-sm text-zinc-600">
            This admin dashboard is ready to display data from your backend.
          </p>
          <p className="mt-1 text-xs text-zinc-500">
            Configure API endpoints for: Stats, Blood Inventory, Requests, Donors, and Alerts
          </p>
          
          <div className="mt-8 grid grid-cols-1 gap-3 text-left max-w-md mx-auto">
            <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3">
              <p className="text-xs font-mono text-zinc-700">GET /api/admin/stats</p>
              <p className="mt-1 text-xs text-zinc-500">Dashboard statistics</p>
            </div>
            <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3">
              <p className="text-xs font-mono text-zinc-700">GET /api/admin/blood-inventory</p>
              <p className="mt-1 text-xs text-zinc-500">Blood stock by type</p>
            </div>
            <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3">
              <p className="text-xs font-mono text-zinc-700">GET /api/admin/requests</p>
              <p className="mt-1 text-xs text-zinc-500">Recent blood requests</p>
            </div>
            <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3">
              <p className="text-xs font-mono text-zinc-700">GET /api/admin/donors</p>
              <p className="mt-1 text-xs text-zinc-500">Active donor list</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
