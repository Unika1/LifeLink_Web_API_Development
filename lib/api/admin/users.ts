import axios from "../axios";

export const adminGetUsers = async (
  page?: number,
  limit?: number,
  role?: string,
  token?: string
) => {
  try {
    const query = new URLSearchParams();
    if (page !== undefined) {
      query.append("page", String(page));
    }
    if (limit !== undefined) {
      query.append("limit", String(limit));
    }
    if (role) {
      query.append("role", role);
    }

    const suffix = query.toString() ? `?${query.toString()}` : "";
    const url = `/api/admin/users${suffix}`;
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    const response = await axios.get(url, config);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || error.message || "Failed to fetch users"
    );
  }
};

export const adminGetUserById = async (id: string, token?: string) => {
  try {
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    const response = await axios.get(`/api/admin/users/${id}`, config);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || error.message || "Failed to fetch user"
    );
  }
};

export const adminCreateUser = async (formData: FormData, token?: string) => {
  try {
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    const response = await axios.post("/api/admin/users", formData, config);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || error.message || "Failed to create user"
    );
  }
};

export const adminUpdateUser = async (id: string, formData: FormData, token?: string) => {
  try {
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    const response = await axios.put(`/api/admin/users/${id}`, formData, config);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || error.message || "Failed to update user"
    );
  }
};

export const adminDeleteUser = async (id: string, token?: string) => {
  try {
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    const response = await axios.delete(`/api/admin/users/${id}`, config);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || error.message || "Failed to delete user"
    );
  }
};
