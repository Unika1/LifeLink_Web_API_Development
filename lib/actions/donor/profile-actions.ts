"use server";

import { updateUserProfile, getUserById } from "@/lib/api/donor/profile";
import { getAuthToken } from "@/lib/cookie";

export async function serverUpdateUserProfile(id: string, formData: FormData) {
  try {
    const token = await getAuthToken();
    const response = await updateUserProfile(id, formData, token || undefined);
    return {
      success: true,
      data: response,
      message: "Profile updated successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to update profile",
    };
  }
}

export async function serverGetUserProfile(id: string) {
  try {
    const token = await getAuthToken();
    const response = await getUserById(id, token || undefined);
    return {
      success: true,
      data: response,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to fetch profile",
    };
  }
}
