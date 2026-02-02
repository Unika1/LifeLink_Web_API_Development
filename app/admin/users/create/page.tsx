"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createUser } from "@/lib/api/user";

export default function CreateUserPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
    phone: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validation
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.password
    ) {
      setError("Please fill in all required fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);

      // Create FormData object for multer
      const form = new FormData();
      form.append("firstName", formData.firstName);
      form.append("lastName", formData.lastName);
      form.append("email", formData.email);
      form.append("password", formData.password);
      form.append("role", formData.role);
      if (formData.phone) {
        form.append("phone", formData.phone);
      }
      if (imageFile) {
        form.append("image", imageFile);
      }

      const response = await createUser(form);

      if (response.success) {
        setSuccess("User created successfully!");
        setTimeout(() => {
          router.push("/admin/users");
        }, 1500);
      } else {
        setError(response.message || "Failed to create user");
      }
    } catch (err: any) {
      setError(err.message || "Failed to create user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900">Create New User</h1>
          <p className="mt-1 text-zinc-600">Add a new staff or user to the system</p>
        </div>
        <Link
          href="/admin/users"
          className="text-zinc-600 hover:text-zinc-900 font-semibold"
        >
          ← Back
        </Link>
      </div>

      {/* Form Card */}
      <div className="rounded-xl border border-zinc-200 bg-white p-8">
        {/* Success Message */}
        {success && (
          <div className="mb-6 rounded-lg bg-green-50 p-4 text-sm text-green-700">
            ✓ {success}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-700">
            ✕ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-semibold text-zinc-900 mb-2">
              Profile Image
            </label>
            <div className="flex gap-4 items-center">
              {imagePreview && (
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border-2 border-zinc-200">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full cursor-pointer rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-700 file:mr-3 file:cursor-pointer file:rounded file:border-0 file:bg-[#d4002a] file:px-3 file:py-1.5 file:text-sm file:text-white file:hover:bg-[#b8002a]"
                />
                <p className="mt-1 text-xs text-zinc-500">PNG, JPG, GIF up to 5MB</p>
              </div>
            </div>
          </div>

          {/* Name Fields */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="block text-sm font-semibold text-zinc-900 mb-2">
                First Name *
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="John"
                className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 text-zinc-900 placeholder-zinc-500 focus:border-[#d4002a] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-zinc-900 mb-2">
                Last Name *
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="Doe"
                className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 text-zinc-900 placeholder-zinc-500 focus:border-[#d4002a] focus:outline-none"
              />
            </div>
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-sm font-semibold text-zinc-900 mb-2">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="john@example.com"
              className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 text-zinc-900 placeholder-zinc-500 focus:border-[#d4002a] focus:outline-none"
            />
          </div>

          {/* Password Fields */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="block text-sm font-semibold text-zinc-900 mb-2">
                Password *
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="At least 6 characters"
                className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 text-zinc-900 placeholder-zinc-500 focus:border-[#d4002a] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-zinc-900 mb-2">
                Confirm Password *
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm password"
                className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 text-zinc-900 placeholder-zinc-500 focus:border-[#d4002a] focus:outline-none"
              />
            </div>
          </div>

          {/* Role Select */}
          <div>
            <label className="block text-sm font-semibold text-zinc-900 mb-2">
              Role *
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 text-zinc-900 focus:border-[#d4002a] focus:outline-none"
            >
              <option value="user">User</option>
              <option value="staff">Staff</option>
              <option value="admin">Admin</option>
            </select>
            <p className="mt-1 text-xs text-zinc-600">
              Choose the user's role in the system
            </p>
          </div>

          {/* Phone Field (Optional) */}
          <div>
            <label className="block text-sm font-semibold text-zinc-900 mb-2">
              Phone (Optional)
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="+1 (555) 123-4567"
              className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 text-zinc-900 placeholder-zinc-500 focus:border-[#d4002a] focus:outline-none"
            />
          </div>

          {/* Form Info */}
          <div className="rounded-lg bg-blue-50 p-4 text-sm text-blue-700">
            <p>
              <strong>Note:</strong> This form uses FormData for file upload
              support via the POST /api/auth/user endpoint (using Multer).
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-lg bg-[#d4002a] px-4 py-2 font-semibold text-white hover:bg-[#b8002a] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating..." : "Create User"}
            </button>
            <Link
              href="/admin/users"
              className="flex-1 rounded-lg border border-zinc-300 px-4 py-2 font-semibold text-zinc-900 hover:bg-zinc-50 transition text-center"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
