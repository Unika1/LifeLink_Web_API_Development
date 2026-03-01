"use server";

import { adminCreateHospital, adminUpdateHospital, adminDeleteHospital } from "@/lib/api/admin/hospitals";
import { getHospitals, getHospitalById } from "@/lib/api/hospital/info";
import { getAuthToken } from "@/lib/cookie";

interface CreateHospitalData {
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
}

interface UpdateHospitalData {
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

export async function serverGetHospitals() {
  try {
    const token = await getAuthToken();
    const response = await getHospitals(token || undefined);
    return {
      success: true,
      data: response,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to fetch hospitals",
    };
  }
}

export async function serverGetHospitalById(id: string) {
  try {
    const token = await getAuthToken();
    const response = await getHospitalById(id, token || undefined);
    return {
      success: true,
      data: response,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to fetch hospital",
    };
  }
}

export async function serverAdminCreateHospital(data: CreateHospitalData) {
  try {
    const token = await getAuthToken();
    const response = await adminCreateHospital(data);
    return {
      success: true,
      data: response,
      message: "Hospital created successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to create hospital",
    };
  }
}

export async function serverAdminUpdateHospital(id: string, data: UpdateHospitalData) {
  try {
    const token = await getAuthToken();
    const response = await adminUpdateHospital(id, data);
    return {
      success: true,
      data: response,
      message: "Hospital updated successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to update hospital",
    };
  }
}

export async function serverAdminDeleteHospital(id: string) {
  try {
    const token = await getAuthToken();
    const response = await adminDeleteHospital(id);
    return {
      success: true,
      data: response,
      message: "Hospital deleted successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to delete hospital",
    };
  }
}
