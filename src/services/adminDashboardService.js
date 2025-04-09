import axios from "axios";
import environment from "../assets/environment/environment";

const API_BASE_URL = environment.API_BASE_URL;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error("API Error:", {
        status: error.response.status,
        message: error.response.data?.message || "Unknown error",
        url: error.config.url,
      });
    }
    return Promise.reject(error);
  }
);

export const fetchAdminTaskStats = async (adminId) => {
  try {
    const response = await apiClient.get(`/admin-tasks/${adminId}`);
    return response.data; // Directly return the response data
  } catch (error) {
    let errorMessage = "Failed to load task data. Please try again.";
    
    if (error.response) {
      switch (error.response.status) {
        case 401: errorMessage = "Session expired. Please login again."; break;
        case 403: errorMessage = "You don't have permission to view this data."; break;
        case 404: errorMessage = "Admin data not found."; break;
        case 500: errorMessage = "Server error. Please try again later."; break;
      }
    }
    throw new Error(errorMessage);
  }
};