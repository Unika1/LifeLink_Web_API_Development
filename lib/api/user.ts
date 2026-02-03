import axios from "./axios";

export const createUser = async (formData: FormData) => {
  try {
    const response = await axios.post("/api/auth/user", formData);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || error.message || "Failed to create user"
    );
  }
};

export const getUsers = async () => {
  try {
    const response = await axios.get("/api/auth/users");
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || error.message || "Failed to fetch users"
    );
  }
};

export const getUserById = async (id: string) => {
  try {
    const response = await axios.get(`/api/auth/users/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || error.message || "Failed to fetch user"
    );
  }
};

export const updateUser = async (id: string, data: any) => {
  try {
    const response = await axios.put(`/api/auth/users/${id}`, data);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || error.message || "Failed to update user"
    );
  }
};

export const deleteUser = async (id: string) => {
  try {
    const response = await axios.delete(`/api/auth/users/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || error.message || "Failed to delete user"
    );
  }
};

// Admin API Functions
export const adminGetUsers = async () => {
  try {
    const response = await axios.get("/api/admin/users");
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || error.message || "Failed to fetch users"
    );
  }
};

export const adminGetUserById = async (id: string) => {
  try {
    const response = await axios.get(`/api/admin/users/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || error.message || "Failed to fetch user"
    );
  }
};

export const adminCreateUser = async (formData: FormData) => {
  try {
    const response = await axios.post("/api/admin/users", formData);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || error.message || "Failed to create user"
    );
  }
};

export const adminUpdateUser = async (id: string, formData: FormData) => {
  try {
    const response = await axios.put(`/api/admin/users/${id}`, formData);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || error.message || "Failed to update user"
    );
  }
};

export const adminDeleteUser = async (id: string) => {
  try {
    const response = await axios.delete(`/api/admin/users/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || error.message || "Failed to delete user"
    );
  }
};

export const updateUserProfile = async (id: string, formData: FormData) => {
  try {
    const response = await axios.put(`/api/auth/${id}`, formData);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || error.message || "Failed to update profile"
    );
  }
};
