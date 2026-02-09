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
  data: { status?: string; scheduledAt?: string }
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
