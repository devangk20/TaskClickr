import axios from "axios";
const API_URL = "http://localhost:5000/api/users"; // Use backend port
 // Ensure correct base API route

// Configure Axios instance with a base URL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Fetch all users
export const getUsers = async () => {
  try {
    const response = await api.get("/");
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("Error fetching users:", error.response?.data || error.message);
    return [];
  }
};

// Add a new user
export const addUser = async (userData) => {
  try {
    const response = await api.post("/", userData);
    return response.data;
  } catch (error) {
    console.error("Error adding user:", error.response?.data || error.message);
    throw error;
  }
};

// Update user details
export const updateUser = async (userId, updatedUserData) => {
  try {
    const response = await api.put(`/${userId}`, updatedUserData);
    return response.data;
  } catch (error) {
    console.error("Error updating user:", error.response?.data || error.message);
    throw error;
  }
};

// Delete a user
export const deleteUser = async (userId) => {
  try {
    await api.delete(`/${userId}`);
  } catch (error) {
    console.error("Error deleting user:", error.response?.data || error.message);
    throw error;
  }
};
