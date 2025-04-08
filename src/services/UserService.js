import axios from "axios";
import environment from "../assets/environment/environment";

const API_BASE_URL = environment.API_BASE_URL;
 // Ensure correct base API route

// Configure Axios instance with a base URL
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Fetch all users
export const getUsers = async () => {
  try {
    const response = await fetch("http://localhost:5000/api/users/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error response:", errorData);
      throw new Error(errorData.message || "Failed to fetch users");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
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
