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

export const submitEligibilityQuestionnaire = async (data: {
  age: number;
  weight: number;
  gender: "male" | "female" | "other";
  hasBloodPressure: boolean;
  hasDiabetes: boolean;
  hasHeartDisease: boolean;
  hasCancer: boolean;
  hasHepatitis: boolean;
  hasHIV: boolean;
  hasTuberculosis: boolean;
  recentTravel: boolean;
  travelCountries?: string[];
  takingMedications: boolean;
  medications?: string[];
  activeInfection: boolean;
  infectionDetails?: string;
  isPregnant?: boolean;
  isBreastfeeding?: boolean;
  hasRecentTattoo: boolean;
  hasRecentPiercing: boolean;
  hadBloodTransfusion: boolean;
  additionalNotes?: string;
}) => {
  try {
    const response = await axios.post("/api/eligibility/submit", data);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Failed to submit eligibility questionnaire"
    );
  }
};

export const checkEligibility = async () => {
  try {
    const response = await axios.get("/api/eligibility/check");
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Failed to check eligibility"
    );
  }
};

export const getMyQuestionnaire = async () => {
  try {
    const response = await axios.get("/api/eligibility/questionnaire");
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Failed to fetch questionnaire"
    );
  }
};
