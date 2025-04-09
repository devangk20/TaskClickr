import axios from "axios";
import environment from "../assets/environment/environment";

const API_BASE_URL = environment.API_BASE_URL;

// Configure Axios instance
const api = axios.create({
  baseURL: `${API_BASE_URL}/users`, // Assumes all routes are under `/api/users`
  headers: {
    "Content-Type": "application/json",
  },
});

// Fetch all users
export const getUsers = async () => {
  try {
    const response = await api.get("/");
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to fetch users");
  }
};

// Add a new user
export const addUser = async (userData) => {
  try {
    const response = await api.post("/", userData);
    return response.data;
  } catch (error) {
    console.error("Error adding user:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to add user");
  }
};

// Update user details
export const updateUser = async (userId, updatedUserData) => {
  try {
    const response = await api.put(`/${userId}`, updatedUserData);
    return response.data;
  } catch (error) {
    console.error("Error updating user:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to update user");
  }
};

// Delete a user
export const deleteUser = async (userId) => {
  try {
    await api.delete(`/${userId}`);
  } catch (error) {
    console.error("Error deleting user:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to delete user");
  }
};
