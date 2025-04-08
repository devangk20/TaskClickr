import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

// ✅ Create an Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Automatically attach Authorization token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// ✅ Handle token expiry & unauthorized access
api.interceptors.response.use(
  (response) => response, // Pass successful response
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn("Unauthorized: Token expired or invalid. Logging out...");
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      window.location.href = "/login"; // Redirect to login
    }
    return Promise.reject(error);
  }
);

export default api;
