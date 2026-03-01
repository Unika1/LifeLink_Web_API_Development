"use server";

import { adminGetUsers, adminGetUserById, adminCreateUser, adminUpdateUser, adminDeleteUser } from "@/lib/api/user";
import { getAuthToken } from "@/lib/cookie";

export async function serverAdminGetUsers(page?: number, limit?: number, role?: string) {
  try {
    const token = await getAuthToken();
    const response = await adminGetUsers(page, limit, role, token || undefined);
    return {
      success: true,
      data: response,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to fetch users",
    };
  }
}

export async function serverAdminGetUserById(id: string) {
  try {
    const token = await getAuthToken();
    const response = await adminGetUserById(id, token || undefined);
    return {
      success: true,
      data: response,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to fetch user",
    };
  }
}

export async function serverAdminCreateUser(formData: FormData) {
  try {
    const token = await getAuthToken();
    const response = await adminCreateUser(formData, token || undefined);
    return {
      success: true,
      data: response,
      message: "User created successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to create user",
    };
  }
}

export async function serverAdminUpdateUser(id: string, formData: FormData) {
  try {
    const token = await getAuthToken();
    const response = await adminUpdateUser(id, formData, token || undefined);
    return {
      success: true,
      data: response,
      message: "User updated successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to update user",
    };
  }
}

export async function serverAdminDeleteUser(id: string) {
  try {
    const token = await getAuthToken();
    const response = await adminDeleteUser(id, token || undefined);
    return {
      success: true,
      data: response,
      message: "User deleted successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to delete user",
    };
  }
}
