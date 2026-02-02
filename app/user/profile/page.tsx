"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUserData } from "@/lib/cookie";
import { updateUserProfile } from "@/lib/api/user";

interface UserData {
  _id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  phone?: string;
  bio?: string;
  role: string;
  createdAt: string;
  [key: string]: any;
}

export default function UserProfile() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    bio: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await getUserData();
        if (userData) {
          setUser(userData as UserData);
          setFormData({
            firstName: userData.firstName || "",
            lastName: userData.lastName || "",
            email: userData.email || "",
            phone: userData.phone || "",
            bio: userData.bio || "",
          });
        }
      } catch (err) {
        console.error("Failed to load user data", err);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const form = new FormData();
      form.append("firstName", formData.firstName);
      form.append("lastName", formData.lastName);
      form.append("email", formData.email);
      if (formData.phone) {
        form.append("phone", formData.phone);
      }
      if (formData.bio) {
        form.append("bio", formData.bio);
      }
      if (imageFile) {
        form.append("image", imageFile);
      }

      await updateUserProfile(user!._id, form);

      setSuccess("Profile updated successfully!");
      setIsEditing(false);
      setImageFile(null);
      setProfileImage(null);

      // Update local user data
      setUser((prev) =>
        prev ? { ...prev, ...formData } : null
      );

      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to update profile");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-zinc-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f6fa] p-6">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-zinc-900">My Profile</h1>
          <p className="mt-2 text-zinc-600">Manage your profile information</p>
        </div>

        {/* Profile Card */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-8">
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

          {/* Profile Info */}
          <div className="mb-8 flex items-start gap-6">
            <div className="relative">
              {profileImage || user?.profileImage ? (
                <img
                  src={profileImage || user?.profileImage}
                  alt="Profile"
                  className="h-20 w-20 rounded-full object-cover ring-2 ring-zinc-200"
                />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-linear-to-br from-[#d4002a] to-[#ff6b9d] text-3xl text-white">
                  {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                </div>
              )}
              {isEditing && (
                <label className="absolute -bottom-1 -right-1 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-[#d4002a] text-white hover:bg-[#b8002a] transition">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <span className="text-sm">📷</span>
                </label>
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-zinc-900">
                {user?.firstName} {user?.lastName}
              </h2>
              <p className="mt-1 text-zinc-600">{user?.email}</p>
              <div className="mt-3 inline-block rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700 capitalize">
                {user?.role}
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="block text-sm font-semibold text-zinc-900 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 text-zinc-900 placeholder-zinc-500 disabled:bg-zinc-100 disabled:text-zinc-500"
                  placeholder="First name"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-zinc-900 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 text-zinc-900 placeholder-zinc-500 disabled:bg-zinc-100 disabled:text-zinc-500"
                  placeholder="Last name"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-zinc-900 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 text-zinc-900 placeholder-zinc-500 disabled:bg-zinc-100 disabled:text-zinc-500"
                placeholder="Email"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-zinc-900 mb-2">
                Phone (Optional)
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 text-zinc-900 placeholder-zinc-500 disabled:bg-zinc-100 disabled:text-zinc-500"
                placeholder="Phone number"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-zinc-900 mb-2">
                Bio (Optional)
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                disabled={!isEditing}
                rows={4}
                className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 text-zinc-900 placeholder-zinc-500 disabled:bg-zinc-100 disabled:text-zinc-500"
                placeholder="Tell us about yourself"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              {!isEditing ? (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsEditing(true);
                  }}
                  className="flex-1 rounded-lg bg-[#d4002a] px-4 py-2 font-semibold text-white hover:bg-[#b8002a] transition"
                >
                  Edit Profile
                </button>
              ) : (
                <>
                  <button
                    type="submit"
                    className="flex-1 rounded-lg bg-[#d4002a] px-4 py-2 font-semibold text-white hover:bg-[#b8002a] transition"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setImageFile(null);
                      setProfileImage(null);
                      setFormData({
                        firstName: user?.firstName || "",
                        lastName: user?.lastName || "",
                        email: user?.email || "",
                        phone: user?.phone || "",
                        bio: user?.bio || "",
                      });
                    }}
                    className="flex-1 rounded-lg border border-zinc-300 px-4 py-2 font-semibold text-zinc-900 hover:bg-zinc-50 transition"
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
