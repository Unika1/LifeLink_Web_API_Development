import axios from "../axios";

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
