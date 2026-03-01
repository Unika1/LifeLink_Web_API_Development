import axios from "../axios";

export const getHospitalInventory = async (id: string, token?: string) => {
  try {
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    const response = await axios.get(`/api/hospitals/${id}/inventory`, config);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Failed to fetch inventory"
    );
  }
};

export const updateHospitalInventory = async (
  id: string,
  data: { bloodType: string; unitsAvailable: number },
  token?: string
) => {
  try {
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    const response = await axios.put(`/api/hospitals/${id}/inventory`, data, config);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Failed to update inventory"
    );
  }
};

export const createHospitalInventory = async (
  id: string,
  data: { bloodType: string; unitsAvailable: number },
  token?: string
) => {
  try {
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    const response = await axios.post(`/api/hospitals/${id}/inventory`, data, config);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Failed to add inventory"
    );
  }
};

export const deleteHospitalInventory = async (
  id: string,
  bloodType: string,
  token?: string
) => {
  try {
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    const response = await axios.delete(
      `/api/hospitals/${id}/inventory/${encodeURIComponent(bloodType)}`,
      config
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Failed to delete inventory"
    );
  }
};
