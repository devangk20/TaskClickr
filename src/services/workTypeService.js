import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

export const fetchWorkTypes = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/work-types`);
    return response.data.map((type) => ({
      value: type.work_type_id,
      label: type.work_type,
    }));
  } catch (error) {
    console.error("❌ Error fetching work types:", error);
    // Fallback to default work types if API fails
    return [
      { value: 1, label: "Internet Plan" },
      { value: 2, label: "Splicing" },
      { value: 3, label: "CCTV" },
      { value: 4, label: "Networking" },
      { value: 5, label: "Send Invoice" },
      { value: 6, label: "Other" },
    ];
  }
};