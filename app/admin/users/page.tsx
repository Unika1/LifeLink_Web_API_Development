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

interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    loadUsers(currentPage, pageSize);
  }, [currentPage, pageSize]);

  const loadUsers = async (page: number, limit: number) => {
    try {
      setLoading(true);
      setError("");
      const response = await adminGetUsers(page, limit);
      if (response.success) {
        setUsers(response.data || []);
        if (response.pagination) {
          setPagination(response.pagination);
        }
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
      // Reload to update pagination
      loadUsers(currentPage, pageSize);
    } catch (err: any) {
      setError(err.message || "Failed to delete user");
    }
  };

  const goToPage = (page: number) => {
    if (page >= 1 && (!pagination || page <= pagination.totalPages)) {
      setCurrentPage(page);
    }
  };

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
          <p className="mt-1 text-zinc-600">
            {pagination ? `Showing ${users.length} of ${pagination.total} users` : "Manage hospital staff and system users"}
          </p>
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

      {/* Page Size Selector */}
      <div className="rounded-xl border border-zinc-200 bg-white p-4">
        <label className="text-sm font-medium text-zinc-900">
          Items per page:
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="ml-3 rounded-lg border border-zinc-300 bg-white px-3 py-1 text-zinc-900 focus:border-[#d4002a] focus:outline-none"
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
        </label>
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
              {users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-zinc-600">
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((user) => (
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
                            : user.role === "hospital"
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

      {/* Pagination Controls */}
      {pagination && pagination.totalPages > 1 && (
        <div className="rounded-xl border border-zinc-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-zinc-600">
              Page {pagination.page} of {pagination.totalPages}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                ← Previous
              </button>

              {/* Page Numbers */}
              <div className="flex gap-1">
                {Array.from({ length: pagination.totalPages }, (_, i) => {
                  const pageNum = i + 1;
                  // Show first page, last page, current page, and neighbors
                  const showPage =
                    pageNum === 1 ||
                    pageNum === pagination.totalPages ||
                    Math.abs(pageNum - pagination.page) <= 1;

                  if (!showPage && i > 0 && i < pagination.totalPages - 1) {
                    if (i === 1) return <span key="dots1" className="px-2">...</span>;
                    if (i === pagination.totalPages - 2) return <span key="dots2" className="px-2">...</span>;
                    return null;
                  }

                  if (showPage) {
                    return (
                      <button
                        key={pageNum}
                        onClick={() => goToPage(pageNum)}
                        className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                          pageNum === currentPage
                            ? "bg-[#d4002a] text-white"
                            : "border border-zinc-300 text-zinc-900 hover:bg-zinc-50"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  }
                  return null;
                })}
              </div>

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === pagination.totalPages}
                className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Next →
              </button>
            </div>
          </div>
        </div>
      )}

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
