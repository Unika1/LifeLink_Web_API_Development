import axios from "./axios";

export interface OrganRequest {
  _id?: string;
  hospitalId?: string;
  hospitalName: string;
  donorName: string;
  requestedBy?: string;
  reportUrl?: string;
  status: "pending" | "approved" | "rejected" | "fulfilled";
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const getOrganRequests = async (params?: {
  hospitalId?: string;
  hospitalName?: string;
  requestedBy?: string;
  status?: string;
}, token?: string) => {
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
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    const response = await axios.get(`/api/organ-requests${suffix}`, config);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || error.message || "Failed to fetch organ requests"
    );
  }
};

export const getOrganRequestById = async (id: string, token?: string) => {
  try {
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    const response = await axios.get(`/api/organ-requests/${id}`, config);
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || error.message || "Failed to fetch organ request",
      data: null,
    };
  }
};

export const createOrganRequest = async (formData: FormData) => {
  try {
    const response = await axios.post("/api/organ-requests", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || error.message || "Failed to create organ request"
    );
  }
};

export const updateOrganRequest = async (
  id: string,
  data: Partial<OrganRequest> | FormData
) => {
  try {
    const isFormData = typeof FormData !== "undefined" && data instanceof FormData;
    const response = await axios.put(`/api/organ-requests/${id}`, data, isFormData ? {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    } : undefined);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || error.message || "Failed to update organ request"
    );
  }
};

export const deleteOrganRequest = async (id: string, token?: string) => {
  try {
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    const response = await axios.delete(`/api/organ-requests/${id}`, config);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || error.message || "Failed to delete organ request"
    );
  }
};
