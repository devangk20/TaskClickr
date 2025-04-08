import axios from "axios";

import environment from "../assets/environment/environment";

const API_BASE_URL = environment.API_BASE_URL;

/**
 * Fetch admin's task statistics.
 * @param {string} adminId - The Admin ID.
 * @returns {Promise<Object>} - Task summary data.
 */
export const fetchAdminTaskStats = async (adminId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/admin-tasks/${adminId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching admin task stats:", error);
    throw new Error("Failed to load task data. Please try again.");
  }
};
