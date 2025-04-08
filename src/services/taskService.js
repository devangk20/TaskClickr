import axios from "axios";
import environment from "../assets/environment/environment";

const API_BASE_URL = environment.API_BASE_URL;

const USER_TASKS_URL = environment.API_BASE_URL; // ✅ Added endpoint

// Function to get auth headers with JWT token
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// ✅ Fetch all tasks (for admin/supervisor)
export const fetchTasks = async () => {
  try {
    const response = await axios.get(API_BASE_URL, {
      headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching tasks:", error.response?.data || error);
    throw error;
  }
};

// ✅ Fetch only the tasks assigned to the logged-in user
export const fetchUserTasks = async () => {
  try {
    const response = await axios.get(USER_TASKS_URL, {
      headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching user tasks:", error.response?.data || error);
    throw error;
  }
};

// ✅ Create a new task
export const createTask = async (taskData) => {
  try {
    const response = await axios.post(API_BASE_URL, taskData, {
      headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    console.error("❌ Error creating task:", error.response?.data || error);
    throw error;
  }
};

// ✅ Update task
export const updateTask = async (taskId, updatedData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/${taskId}`, updatedData, {
      headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    console.error("❌ Error updating task:", error.response?.data || error);
    throw error;
  }
};
// ✅ Delete task
export const deleteTask = async (taskId) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/${taskId}`, {
      headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    console.error("❌ Error deleting task:", error.response?.data || error);
    throw error;
  }
};
