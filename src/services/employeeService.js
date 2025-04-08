import axios from "axios";

import environment from "../assets/environment/environment";

const API_BASE_URL = environment.API_BASE_URL;

export const fetchEmployees = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/employees`);
    return response.data.map((user) => ({
      value: user.user_id,
      label: `${user.first_name} ${user.last_name} (${
        user.role_id === 1 ? "Admin" : user.role_id === 3 ? "Super Admin" : "Employee"
      })`,
    }));
  } catch (error) {
    console.error("❌ Error fetching employees:", error);
    throw error;
  }
};