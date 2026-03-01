"use server";

import { getHospitalInventory, updateHospitalInventory, createHospitalInventory, deleteHospitalInventory } from "@/lib/api/hospital/inventory";
import { getAuthToken } from "@/lib/cookie";

export async function serverGetHospitalInventory(id: string) {
  try {
    const token = await getAuthToken();
    const response = await getHospitalInventory(id, token || undefined);
    return {
      success: true,
      data: response,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to fetch inventory",
    };
  }
}

export async function serverUpdateHospitalInventory(
  id: string,
  data: { bloodType: string; unitsAvailable: number }
) {
  try {
    const token = await getAuthToken();
    const response = await updateHospitalInventory(id, data, token || undefined);
    return {
      success: true,
      data: response,
      message: "Inventory updated successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to update inventory",
    };
  }
}

export async function serverCreateHospitalInventory(
  id: string,
  data: { bloodType: string; unitsAvailable: number }
) {
  try {
    const token = await getAuthToken();
    const response = await createHospitalInventory(id, data, token || undefined);
    return {
      success: true,
      data: response,
      message: "Inventory item added successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to add inventory",
    };
  }
}

export async function serverDeleteHospitalInventory(id: string, bloodType: string) {
  try {
    const token = await getAuthToken();
    const response = await deleteHospitalInventory(id, bloodType, token || undefined);
    return {
      success: true,
      data: response,
      message: "Inventory item deleted successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to delete inventory",
    };
  }
}
