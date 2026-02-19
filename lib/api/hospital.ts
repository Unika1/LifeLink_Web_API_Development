import axios from "./axios";

export const getHospitals = async () => {
  try {
    const response = await axios.get("/api/hospitals");
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || error.message || "Failed to fetch hospitals"
    );
  }
};

export const getHospitalById = async (id: string) => {
  try {
    const response = await axios.get(`/api/hospitals/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || error.message || "Failed to fetch hospital"
    );
  }
};

export const getHospitalInventory = async (id: string) => {
  try {
    const response = await axios.get(`/api/hospitals/${id}/inventory`);
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
  data: { bloodType: string; unitsAvailable: number }
) => {
  try {
    const response = await axios.put(`/api/hospitals/${id}/inventory`, data);
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
  data: { bloodType: string; unitsAvailable: number }
) => {
  try {
    const response = await axios.post(`/api/hospitals/${id}/inventory`, data);
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
  bloodType: string
) => {
  try {
    const response = await axios.delete(
      `/api/hospitals/${id}/inventory/${encodeURIComponent(bloodType)}`
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

export const getDonors = async () => {
  try {
    const response = await axios.get("/api/hospitals/donors");
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || error.message || "Failed to fetch donors"
    );
  }
};

export const adminCreateHospital = async (data: {
  name: string;
  email: string;
  phoneNumber: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  username: string;
  password: string;
  confirmPassword: string;
}) => {
  try {
    const response = await axios.post("/api/hospitals", data);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || error.message || "Failed to create hospital"
    );
  }
};

export const adminDeleteHospital = async (id: string) => {
  try {
    const response = await axios.delete(`/api/hospitals/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || error.message || "Failed to delete hospital"
    );
  }
};

export const adminUpdateHospital = async (
  id: string,
  data: {
    name?: string;
    email?: string;
    phoneNumber?: string;
    address?: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
    isActive?: boolean;
  }
) => {
  try {
    const response = await axios.put(`/api/hospitals/${id}`, data);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || error.message || "Failed to update hospital"
    );
  }
};
