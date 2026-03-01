import axios from "../axios";

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
  },
  token?: string
) => {
  try {
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    const response = await axios.put(`/api/requests/${id}`, data, config);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || error.message || "Failed to update request"
    );
  }
};

export const deleteRequest = async (id: string, token?: string) => {
  try {
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    const response = await axios.delete(`/api/requests/${id}`, config);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || error.message || "Failed to delete request"
    );
  }
};
