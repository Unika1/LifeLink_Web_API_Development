"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { adminGetUserById, adminDeleteUser } from "@/lib/api/user";

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  bio?: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const response = await adminGetUserById(id);
        if (response.success) {
          setUser(response.data);
        }
      } catch (err: any) {
        setError(err.message || "Failed to load user");
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [id]);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    
    try {
      setDeleting(true);
      await adminDeleteUser(id);
      router.push("/admin/users");
    } catch (err: any) {
      setError(err.message || "Failed to delete user");
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-zinc-600">Loading...</div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="space-y-4">
        <div className="rounded-lg bg-red-50 p-4 text-red-700">
          ✕ {error || "User not found"}
        </div>
        <Link
          href="/admin/users"
          className="inline-block rounded-lg bg-[#d4002a] px-4 py-2 font-semibold text-white hover:bg-[#b8002a] transition"
        >
          Back to Users
        </Link>
      </div>
    );
  }

  const getRoleBgColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-purple-100";
      case "staff":
        return "bg-blue-100";
      default:
        return "bg-gray-100";
    }
  };

  const getRoleTextColor = (role: string) => {
    switch (role) {
      case "admin":
        return "text-purple-700";
      case "staff":
        return "text-blue-700";
      default:
        return "text-gray-700";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900">User Details</h1>
        </div>
        <Link
          href="/admin/users"
          className="text-zinc-600 hover:text-zinc-900 font-semibold"
        >
          ← Back
        </Link>
      </div>

      {/* User Card */}
      <div className="rounded-xl border border-zinc-200 bg-white p-8">
        <div className="flex flex-col items-start gap-6 md:flex-row">
          {/* Avatar */}
          <div className="flex h-32 w-32 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-[#d4002a] to-[#ff6b9d] text-5xl text-white">
            {user.firstName.charAt(0)}
            {user.lastName.charAt(0)}
          </div>

          {/* Info */}
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-zinc-900">
              {user.firstName} {user.lastName}
            </h2>

            <div className="mt-4 flex flex-wrap gap-4">
              <div>
                <p className="text-sm text-zinc-600">Email</p>
                <p className="mt-1 font-medium text-zinc-900">{user.email}</p>
              </div>
              <div>
                <p className="text-sm text-zinc-600">Role</p>
                <p className={`mt-1 inline-block rounded-full px-3 py-1 text-sm font-semibold ${getRoleBgColor(user.role)} ${getRoleTextColor(user.role)}`}>
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </p>
              </div>
              {user.phone && (
                <div>
                  <p className="text-sm text-zinc-600">Phone</p>
                  <p className="mt-1 font-medium text-zinc-900">{user.phone}</p>
                </div>
              )}
            </div>

            <div className="mt-6 flex gap-3">
              <Link
                href={`/admin/users/${id}/edit`}
                className="rounded-lg bg-[#d4002a] px-6 py-2 font-semibold text-white hover:bg-[#b8002a] transition"
              >
                Edit User
              </Link>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="rounded-lg bg-red-600 px-6 py-2 font-semibold text-white hover:bg-red-700 transition disabled:bg-gray-400"
              >
                {deleting ? "Deleting..." : "Delete User"}
              </button>
            </div>
          </div>
        </div>

        {/* Additional Details */}
        <div className="mt-8 border-t border-zinc-200 pt-8">
          <h3 className="text-lg font-semibold text-zinc-900 mb-6">
            Additional Information
          </h3>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {user.bio && (
              <div className="md:col-span-2">
                <p className="text-sm font-semibold text-zinc-600">Bio</p>
                <p className="mt-2 text-zinc-900">{user.bio}</p>
              </div>
            )}

            <div>
              <p className="text-sm font-semibold text-zinc-600">User ID</p>
              <p className="mt-2 font-mono text-sm text-zinc-900">{user._id}</p>
            </div>

            <div>
              <p className="text-sm font-semibold text-zinc-600">Member Since</p>
              <p className="mt-2 text-zinc-900">
                {new Date(user.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>

            <div>
              <p className="text-sm font-semibold text-zinc-600">Last Updated</p>
              <p className="mt-2 text-zinc-900">
                {new Date(user.updatedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
