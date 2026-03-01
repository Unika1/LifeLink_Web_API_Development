"use server";

import { getOrganRequests, getOrganRequestById } from "@/lib/api/donor/organ-donations";
import { getAuthToken } from "@/lib/cookie";

interface GetOrganDonationsParams {
  hospitalId?: string;
  hospitalName?: string;
  requestedBy?: string;
  status?: string;
}

export async function serverGetOrganRequests(params?: GetOrganDonationsParams) {
  try {
    const token = await getAuthToken();
    const response = await getOrganRequests(params, token || undefined);
    return {
      success: true,
      data: response,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to fetch organ requests",
    };
  }
}

export async function serverGetOrganRequestById(id: string) {
  try {
    const token = await getAuthToken();
    const response = await getOrganRequestById(id, token || undefined);
    if (!response.success) {
      return {
        success: false,
        message: response.message,
      };
    }
    return {
      success: true,
      data: response,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to fetch organ request",
    };
  }
}
