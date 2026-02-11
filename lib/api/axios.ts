import axios from "axios";
import Cookies from "js-cookie";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5050";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Add request interceptor to include auth token
axiosInstance.interceptors.request.use(
  (config) => {
    if (config.data instanceof FormData) {
      if (config.headers) {
        delete config.headers["Content-Type"];
      }
    }
    const token = Cookies.get("lifelink_token");
    console.log("[axios interceptor] Token from cookie:", token ? "Found" : "Not found");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("[axios interceptor] Set Authorization header");
    } else {
      console.log("[axios interceptor] No token found in cookies");
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
