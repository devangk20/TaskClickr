import axios from "axios";
import environment from "../assets/environment/environment";

const API_BASE_URL = environment.API_BASE_URL;

// Function to get auth headers with JWT token
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json"
  };
};

// ================ TASK ENDPOINTS ================
export const fetchTasks = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/tasks`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching tasks:", error.response?.data || error.message);
    throw error;
  }
};

export const fetchUserTasks = async (userId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/tasks/user/${userId}`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user tasks:", error.response?.data || error.message);
    throw error;
  }
};

export const createTask = async (taskData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/tasks`, taskData, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error("Error creating task:", error.response?.data || error.message);
    throw error;
  }
};

export const updateTask = async (taskId, updatedData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/tasks/${taskId}`, updatedData, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error("Error updating task:", error.response?.data || error.message);
    throw error;
  }
};

export const deleteTask = async (taskId) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/tasks/${taskId}`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting task:", error.response?.data || error.message);
    throw error;
  }
};

// ================ EMPLOYEE ENDPOINTS ================
export const fetchEmployees = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/employees`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching employees:", error.response?.data || error.message);
    throw error;
  }
};