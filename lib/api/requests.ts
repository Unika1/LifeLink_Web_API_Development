import axios from "./axios";

export const getRequests = async (params?: {
  hospitalId?: string;
  hospitalName?: string;
  requestedBy?: string;
  status?: string;
}) => {
  try {
    const query = new URLSearchParams();
    if (params?.hospitalId) {
      query.append("hospitalId", params.hospitalId);
    }
    if (params?.hospitalName) {
      query.append("hospitalName", params.hospitalName);
    }
    if (params?.requestedBy) {
      query.append("requestedBy", params.requestedBy);
    }
    if (params?.status) {
      query.append("status", params.status);
    }
    const suffix = query.toString() ? `?${query.toString()}` : "";
    const response = await axios.get(`/api/requests${suffix}`);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || error.message || "Failed to fetch requests"
    );
  }
};

export const getRequestById = async (id: string) => {
  try {
    console.log("Making request to: /api/requests/" + id);
    const response = await axios.get(`/api/requests/${id}`);
    console.log("getRequestById response:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("getRequestById full error:", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
      url: error.config?.url,
      headers: error.config?.headers,
    });
    return {
      success: false,
      message: error.response?.data?.message || error.message || "Failed to fetch request",
      data: null,
    };
  }
};

export const createRequest = async (data: {
  hospitalName: string;
  patientName: string;
  bloodType: string;
  unitsRequested: number;
  contactPhone?: string;
  neededBy?: string;
  notes?: string;
}) => {
  try {
    const response = await axios.post("/api/requests", data);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || error.message || "Failed to create request"
    );
  }
};

export const updateRequest = async (
  id: string,
  data: {
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
) => {
  try {
    const response = await axios.put(`/api/requests/${id}`, data);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || error.message || "Failed to update request"
    );
  }
};

export const deleteRequest = async (id: string) => {
  try {
    const response = await axios.delete(`/api/requests/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || error.message || "Failed to delete request"
    );
  }
};
