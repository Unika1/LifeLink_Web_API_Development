import axios from "../axios";

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
