import axios from "axios";

const API_URL = "http://localhost:5000/api/daily-activities"; // Update this as needed

export const fetchUserActivities = async (userId, token) => {
  try {
    const response = await axios.get(`${API_URL}/user/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user activities:", error);
    throw error;
  }
};

export const addDailyActivity = async (activityData, token) => {
  try {
    const response = await axios.post(API_URL, activityData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error adding daily activity:", error);
    throw error;
  }
};
