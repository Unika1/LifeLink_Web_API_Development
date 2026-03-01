import axios from "../axios";

export const getLatestEligibilityReport = async (userId: string) => {
  try {
    const response = await axios.get(
      `/api/eligibility/hospital/questionnaires/${userId}`
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Failed to fetch eligibility report"
    );
  }
};
