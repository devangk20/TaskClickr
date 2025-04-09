// src/services/dailyActivityService.js
import axios from "axios";

// Fetch tasks assigned to a user
export const getAssignedTasks = async (userId) => {
  const response = await axios.get(`/api/tasks/assigned/${userId}`);
  return response.data;
};

// Create an ad-hoc task
export const createAdhocTask = async (adhocTask) => {
  const response = await axios.post("/api/tasks/adhoc", adhocTask);
  return response.data;
};

// Log daily activity
export const logDailyActivity = async (activityPayload) => {
  const response = await axios.post("/api/daily-activity", activityPayload);
  return response.data;
};
