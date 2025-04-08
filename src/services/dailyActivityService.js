import axios from "axios";

import environment from "../assets/environment/environment";

const API_BASE_URL = environment.API_BASE_URL;

export const fetchUserActivities = async (userId, token) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/user/${userId}`, {
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
    const response = await axios.post(API_BASE_URL, activityData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error adding daily activity:", error);
    throw error;
  }
};

// ✅ Add fetchTaskDetails function
export const fetchTaskDetails = async (taskId, token) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/task/${taskId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching task details:", error);
    throw error;
  }
};
export const fetchUsers = async (token) => {
    try {
      const response = await axios.get("http://localhost:5000/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  };
  