"use server";

import { createRequest, getRequests, getRequestById } from "@/lib/api/requests";
import { getAuthToken } from "@/lib/cookie";

interface CreateRequestData {
  hospitalName: string;
  patientName: string;
  bloodType: string;
  unitsRequested: number;
  contactPhone?: string;
  neededBy?: string;
  notes?: string;
}

interface GetRequestsParams {
  hospitalId?: string;
  hospitalName?: string;
  requestedBy?: string;
  status?: string;
}

export async function serverCreateRequest(data: CreateRequestData) {
  try {
    const response = await createRequest(data);
    return {
      success: true,
      data: response,
      message: "Request created successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to create request",
    };
  }
}

export async function serverGetHospitalRequests(params?: GetRequestsParams) {
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

export async function serverGetHospitalRequestById(id: string) {
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
