// src/services/adminDashboardService.js

import axios from "axios";
import { saveAs } from "file-saver";
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

// ✅ Task stats for dashboard
export const fetchAdminTaskStats = async (adminId) => {
  try {
    const response = await apiClient.get(`/admin-tasks/${adminId}`);
    return response.data;
  } catch (error) {
    let errorMessage = "Failed to load task data. Please try again.";
    if (error.response) {
      switch (error.response.status) {
        case 401:
          errorMessage = "Session expired. Please login again.";
          break;
        case 403:
          errorMessage = "You don't have permission to view this data.";
          break;
        case 404:
          errorMessage = "Admin data not found.";
          break;
        case 500:
          errorMessage = "Server error. Please try again later.";
          break;
      }
    }
    throw new Error(errorMessage);
  }
};

// ✅ CSV export feature
export const exportTasksToCSV = async () => {
  try {
    const res = await apiClient.get("/export-tasks", {
      responseType: "blob", // Important for downloading files
    });
    saveAs(res.data, "task_stats.csv");
  } catch (error) {
    console.error("CSV Export Error:", error);
    throw new Error("Failed to export tasks to CSV.");
  }
};
