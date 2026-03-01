"use server";

import { createRequest, getRequests, getRequestById } from "@/lib/api/donor/donations";
import { getAuthToken } from "@/lib/cookie";

interface CreateBloodDonationData {
  hospitalName: string;
  patientName: string;
  bloodType: string;
  unitsRequested: number;
  contactPhone?: string;
  neededBy?: string;
  notes?: string;
}

interface GetDonationsParams {
  hospitalId?: string;
  hospitalName?: string;
  requestedBy?: string;
  status?: string;
}

export async function serverCreateBloodDonationRequest(data: CreateBloodDonationData) {
  try {
    const response = await createRequest(data);
    return {
      success: true,
      data: response,
      message: "Blood donation request created successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to create blood donation request",
    };
  }
}

export async function serverGetBloodRequests(params?: GetDonationsParams) {
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
      message: error.message || "Failed to fetch blood requests",
    };
  }
}

export async function serverGetBloodRequestById(id: string) {
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
      message: error.message || "Failed to fetch blood request",
    };
  }
}
