 "use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { adminGetUsers, adminDeleteUser } from "@/lib/api/user";

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await adminGetUsers();
      if (response.success) {
        setUsers(response.data || []);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await adminDeleteUser(id);
      setUsers(users.filter((user) => user._id !== id));
      setDeleteConfirm(null);
    } catch (err: any) {
      setError(err.message || "Failed to delete user");
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = filterRole === "all" || user.role === filterRole;

    return matchesSearch && matchesRole;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-zinc-600">Loading users...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900">Users</h1>
          <p className="mt-1 text-zinc-600">Manage hospital staff and system users</p>
        </div>
        <Link
          href="/admin/users/create"
          className="rounded-lg bg-[#d4002a] px-6 py-2 font-semibold text-white hover:bg-[#b8002a] transition"
        >
          + Add User
        </Link>
      </div>

      {/* Error Message */}
      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
          ✕ {error}
        </div>
      )}

      {/* Filters */}
      <div className="rounded-xl border border-zinc-200 bg-white p-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-6">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 text-zinc-900 placeholder-zinc-500 focus:border-[#d4002a] focus:outline-none"
            />
          </div>
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-zinc-900 focus:border-[#d4002a] focus:outline-none"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="staff">Staff</option>
            <option value="user">User</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-xl border border-zinc-200 bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50">
                <th className="px-6 py-4 text-left font-semibold text-zinc-900">
                  Name
                </th>
                <th className="px-6 py-4 text-left font-semibold text-zinc-900">
                  Email
                </th>
                <th className="px-6 py-4 text-left font-semibold text-zinc-900">
                  Role
                </th>
                <th className="px-6 py-4 text-left font-semibold text-zinc-900">
                  Joined
                </th>
                <th className="px-6 py-4 text-right font-semibold text-zinc-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-zinc-600">
                    No users found
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr
                    key={user._id}
                    className="border-b border-zinc-100 hover:bg-zinc-50 transition"
                  >
                    <td className="px-6 py-4 font-medium text-zinc-900">
                      {user.firstName} {user.lastName}
                    </td>
                    <td className="px-6 py-4 text-zinc-600">{user.email}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                          user.role === "admin"
                            ? "bg-purple-100 text-purple-700"
                            : user.role === "staff"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-zinc-600">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/admin/users/${user._id}`}
                          className="text-[#d4002a] hover:underline text-xs font-semibold"
                        >
                          View
                        </Link>
                        <Link
                          href={`/admin/users/${user._id}/edit`}
                          className="text-blue-600 hover:underline text-xs font-semibold"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => setDeleteConfirm(user._id)}
                          className="text-red-600 hover:underline text-xs font-semibold"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-xl border border-zinc-200 bg-white p-6">
            <h3 className="text-lg font-semibold text-zinc-900">Delete User?</h3>
            <p className="mt-2 text-zinc-600">
              Are you sure you want to delete this user? This action cannot be undone.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 rounded-lg bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700 transition"
              >
                Delete
              </button>
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 rounded-lg border border-zinc-300 px-4 py-2 font-semibold text-zinc-900 hover:bg-zinc-50 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
