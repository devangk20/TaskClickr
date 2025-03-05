import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

export const fetchTasks = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/tasks`);
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching tasks:", error);
    throw error;
  }
};

export const createTask = async (taskData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/create-task`, taskData);
    return response.data;
  } catch (error) {
    console.error("❌ Error creating task:", error.response?.data || error);
    throw error;
  }
};