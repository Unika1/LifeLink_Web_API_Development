"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Image from "next/image";
import { adminGetUserById, adminUpdateUser } from "@/lib/api/user";

const editUserSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  password: z.string().optional(),
  role: z.enum(["donor", "hospital", "admin"]),
});

type EditUserFormData = z.infer<typeof editUserSchema>;

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  imageUrl?: string;
  role: string;
  phone?: string;
}

export default function EditUserForm({ userId }: { userId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<EditUserFormData>({
    resolver: zodResolver(editUserSchema),
  });

  const password = watch("password");

  useEffect(() => {
    const loadUser = async () => {
      try {
        setFetchLoading(true);
        const response = await adminGetUserById(userId);
        const userData = response.data || response;
        setUser(userData);
        reset({
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          phone: userData.phone || "",
          password: "",
          role: userData.role,
        });
        if (userData.imageUrl) {
          setImagePreview(userData.imageUrl);
        }
      } catch (err) {
        setError("Failed to load user data");
        console.error(err);
      } finally {
        setFetchLoading(false);
      }
    };

    loadUser();
  }, [userId, reset]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: EditUserFormData) => {
    try {
      setLoading(true);
      setError(null);

      const formData = new FormData();
      formData.append("firstName", data.firstName);
      formData.append("lastName", data.lastName);
      formData.append("email", data.email);
      formData.append("role", data.role);

      if (data.phone) {
        formData.append("phone", data.phone);
      }

      if (data.password) {
        formData.append("password", data.password);
      }

      if (selectedFile) {
        formData.append("image", selectedFile);
      }

      await adminUpdateUser(userId, formData);
      router.push(`/admin/users/${userId}`);
    } catch (err: any) {
      setError(err.message || "Failed to update user");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-red-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
        <p className="text-red-800">Failed to load user data</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <h2 className="mb-6 text-2xl font-bold">Edit User</h2>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-red-800">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Image Upload */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Profile Image
          </label>
          <div className="flex gap-4">
            {imagePreview && (
              <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg border border-gray-200">
                <Image
                  src={imagePreview}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="flex-1">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full cursor-pointer rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-600 file:mr-3 file:border-0 file:bg-red-600 file:px-3 file:py-1 file:text-white"
              />
              <p className="mt-1 text-xs text-gray-500">
                PNG, JPG, GIF up to 5MB
              </p>
            </div>
          </div>
        </div>

        {/* First Name */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            First Name
          </label>
          <input
            {...register("firstName")}
            type="text"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-red-500 focus:outline-none"
            placeholder="John"
          />
          {errors.firstName && (
            <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
          )}
        </div>

        {/* Last Name */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Last Name
          </label>
          <input
            {...register("lastName")}
            type="text"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-red-500 focus:outline-none"
            placeholder="Doe"
          />
          {errors.lastName && (
            <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            {...register("email")}
            type="email"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-red-500 focus:outline-none"
            placeholder="john@example.com"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Phone (Optional)
          </label>
          <input
            {...register("phone")}
            type="tel"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-red-500 focus:outline-none"
            placeholder="+1 (555) 000-0000"
          />
        </div>

        {/* Password */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Password (Optional - leave blank to keep current password)
          </label>
          <input
            {...register("password")}
            type="password"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-red-500 focus:outline-none"
            placeholder="••••••••"
          />
          {password && password.length < 6 && (
            <p className="mt-1 text-sm text-red-600">
              Password must be at least 6 characters
            </p>
          )}
        </div>

        {/* Role */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Role
          </label>
          <select
            {...register("role")}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-red-500 focus:outline-none"
          >
            <option value="donor">Donor</option>
            <option value="hospital">Hospital</option>
            <option value="admin">Admin</option>
          </select>
          {errors.role && (
            <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 rounded-lg bg-red-600 px-4 py-2 font-medium text-white hover:bg-red-700 disabled:bg-gray-400"
          >
            {loading ? "Updating..." : "Update User"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}