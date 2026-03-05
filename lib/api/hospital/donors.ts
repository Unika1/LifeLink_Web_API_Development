import axios from "../axios";

export const getDonors = async (hospitalId?: string, hospitalName?: string) => {
  try {
    const params: any = {};
    if (hospitalId) params.hospitalId = hospitalId;
    if (hospitalName) params.hospitalName = hospitalName;
    
    const response = await axios.get("/api/hospitals/donors", { params });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || error.message || "Failed to fetch donors"
    );
  }
};
