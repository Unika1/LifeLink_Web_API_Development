"use server";

import { getRequests, getRequestById, updateRequest, deleteRequest } from "@/lib/api/admin/donations";
import { getAuthToken } from "@/lib/cookie";

interface GetRequestsParams {
  hospitalId?: string;
  hospitalName?: string;
  requestedBy?: string;
  status?: string;
}

interface UpdateRequestData {
  hospitalName?: string;
  patientName?: string;
  bloodType?: string;
  unitsRequested?: number;
  contactPhone?: string;
  neededBy?: string;
  notes?: string;
  status?: string;
  scheduledAt?: string;
}

export async function serverGetRequests(params?: GetRequestsParams) {
  try {
    const token = await getAuthToken();
    const response = await getRequests(params, token || undefined);
    return {
      success: true,
      data: response,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to fetch requests",
    };
  }
}

export async function serverGetRequestById(id: string) {
  try {
    const token = await getAuthToken();
    const response = await getRequestById(id, token || undefined);
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
      message: error.message || "Failed to fetch request",
    };
  }
}

export async function serverUpdateRequest(id: string, data: UpdateRequestData) {
  try {
    const token = await getAuthToken();
    const response = await updateRequest(id, data, token || undefined);
    return {
      success: true,
      data: response,
      message: "Request updated successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to update request",
    };
  }
}

export async function serverDeleteRequest(id: string) {
  try {
    const token = await getAuthToken();
    const response = await deleteRequest(id, token || undefined);
    return {
      success: true,
      data: response,
      message: "Request deleted successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to delete request",
    };
  }
}
