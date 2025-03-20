
import axios from "axios";

const API_URL = "http://localhost:8000"; // Replace with your backend URL

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to include the JWT token in headers
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

export const login = async (username: string, password: string) => {
    const response = await api.post("/login", { username, password });
    return response.data;
  };



  export const register = async (
    username: string,
    password: string,
    role: string,
    departmentName: string  // Change this to match the backend
  ) => {
    const response = await api.post("/register", {
      username,
      password,
      role,
      department_name: departmentName,  // Ensure this matches the backend schema
    });
    return response.data;
  };