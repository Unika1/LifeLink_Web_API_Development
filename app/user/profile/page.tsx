"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getUserData } from "@/lib/cookie";
import Cookies from "js-cookie";
import { updateUserProfile } from "@/lib/api/user";

interface UserData {
  _id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  phone?: string;
  bio?: string;
  imageUrl?: string;
  role: string;
  createdAt: string;
  [key: string]: any;
}

export default function UserProfile() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    bio: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const apiBaseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5050";

  const getDisplayImageUrl = (path?: string) => {
    if (!path) return null;
    if (path.startsWith("http")) {
      return `${path}?t=${Date.now()}`;
    }
    const normalized = path.startsWith("/") ? path : `/${path}`;
    return `${apiBaseUrl}${normalized}?t=${Date.now()}`;
  };

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await getUserData();
        const cookieUser = Cookies.get("lifelink_user");
        const parsedCookieUser = cookieUser ? JSON.parse(cookieUser) : null;
        if (userData) {
          setUser(userData as UserData);
          setImageError(false);
          setFormData({
            firstName: userData.firstName || "",
            lastName: userData.lastName || "",
            email: userData.email || "",
            phone: userData.phone || "",
            bio: userData.bio || "",
          });
        } else if (parsedCookieUser) {
          setUser(parsedCookieUser as UserData);
          setImageError(false);
          setFormData({
            firstName: parsedCookieUser.firstName || "",
            lastName: parsedCookieUser.lastName || "",
            email: parsedCookieUser.email || "",
            phone: parsedCookieUser.phone || "",
            bio: parsedCookieUser.bio || "",
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
      setImageError(false);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
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

      if (!user?._id) {
        throw new Error("User ID not found");
      }

      const response = await updateUserProfile(user._id, form);
      const updated =
        response?.data?.data || response?.data?.user || response?.data || response;

      setSuccess("Profile updated successfully!");
      setIsEditing(false);
      setImageFile(null);
      setImageError(false);
      if (updated?.imageUrl) {
        setPreviewImage(null);
      }

      // Update local user data
      const mergedUser = {
        ...(user || {}),
        ...formData,
        imageUrl: updated?.imageUrl ?? user?.imageUrl,
      };

      setUser((prev) =>
        prev
          ? {
              ...prev,
              ...mergedUser,
            }
          : prev
      );
      Cookies.set("lifelink_user", JSON.stringify(mergedUser));

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
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-zinc-200 bg-white sticky top-0 z-40">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-zinc-600 hover:text-zinc-900 transition"
            >
              ← Back
            </button>
            <h1 className="text-2xl font-bold text-zinc-900">Profile Settings</h1>
            <div className="w-20"></div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-6 py-12">
        {/* Success Message */}
        {success && (
          <div className="mb-6 rounded-lg bg-green-50 border border-green-200 p-4 text-sm text-green-700">
            ✓ {success}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-700">
            ✕ {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          {/* Profile Sidebar */}
          <div className="lg:col-span-1">
            <div className="rounded-xl border border-zinc-200 bg-white p-6">
              {/* Profile Image */}
              <div className="flex flex-col items-center">
                <div className="relative mb-4">
                  {previewImage ? (
                    <img
                      src={previewImage}
                      alt="Profile Preview"
                      className="h-32 w-32 rounded-full object-cover ring-4 ring-zinc-200"
                      onError={() => setImageError(true)}
                    />
                  ) : user?.imageUrl && !imageError ? (
                    <img
                      src={getDisplayImageUrl(user.imageUrl) || ""}
                      alt="Profile"
                      className="h-32 w-32 rounded-full object-cover ring-4 ring-zinc-200"
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <div className="flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-[#d4002a] to-[#ff6b9d] text-5xl text-white">
                      {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                    </div>
                  )}
                  <label className="absolute bottom-0 right-0 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-[#d4002a] text-white hover:bg-[#b8002a] transition shadow-lg">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        setIsEditing(true);
                        handleImageChange(e);
                      }}
                      className="hidden"
                    />
                    <span className="text-lg">📷</span>
                  </label>
                </div>

                <h2 className="text-xl font-bold text-zinc-900">
                  {user?.firstName} {user?.lastName}
                </h2>
                <p className="mt-1 text-sm text-zinc-600">{user?.email}</p>
                <div className="mt-3 inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 capitalize">
                  {user?.role}
                </div>

                <p className="mt-6 text-xs text-zinc-500">
                  Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Personal Information */}
              <div className="rounded-xl border border-zinc-200 bg-white p-6">
                <h3 className="mb-6 text-lg font-semibold text-zinc-900">Personal Information</h3>
                
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
              </div>

              {/* Contact Information */}
              <div className="rounded-xl border border-zinc-200 bg-white p-6">
                <h3 className="mb-6 text-lg font-semibold text-zinc-900">Contact Information</h3>
                
                <div className="space-y-6">
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
                </div>
              </div>

              {/* Bio Section */}
              <div className="rounded-xl border border-zinc-200 bg-white p-6">
                <h3 className="mb-6 text-lg font-semibold text-zinc-900">About</h3>
                
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
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                {!isEditing ? (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setIsEditing(true);
                    }}
                    className="rounded-lg bg-[#d4002a] px-6 py-2 font-semibold text-white hover:bg-[#b8002a] transition"
                  >
                    Edit Profile
                  </button>
                ) : (
                  <>
                    <button
                      type="submit"
                      className="rounded-lg bg-[#d4002a] px-6 py-2 font-semibold text-white hover:bg-[#b8002a] transition"
                    >
                      Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false);
                        setImageFile(null);
                        setPreviewImage(null);
                        setFormData({
                          firstName: user?.firstName || "",
                          lastName: user?.lastName || "",
                          email: user?.email || "",
                          phone: user?.phone || "",
                          bio: user?.bio || "",
                        });
                      }}
                      className="rounded-lg border border-zinc-300 px-6 py-2 font-semibold text-zinc-900 hover:bg-zinc-50 transition"
                    >
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </form>
          </div>
        </div>
      </main>

      {/* Bottom Navigation */}
      <footer className="border-t border-zinc-200 bg-white mt-12">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <div className="grid grid-cols-3 gap-8">
            <Link href="/dashboard" className="flex flex-col items-center gap-3 rounded-xl p-4 hover:bg-zinc-50 transition">
              <span className="text-4xl">🏠</span>
              <span className="text-sm font-semibold text-zinc-900">Home</span>
            </Link>

            <Link href="/request" className="flex flex-col items-center gap-3 rounded-xl p-4 hover:bg-zinc-50 transition">
              <span className="text-4xl">🧾</span>
              <span className="text-sm font-semibold text-zinc-900">Request</span>
            </Link>

            <Link href="/user/profile" className="flex flex-col items-center gap-3 rounded-xl p-4 hover:bg-zinc-50 transition">
              <span className="text-4xl">👤</span>
              <span className="text-sm font-semibold text-zinc-900">Profile</span>
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
