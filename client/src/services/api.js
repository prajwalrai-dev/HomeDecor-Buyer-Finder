import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
});

// Attach the JWT token (if present) to every outgoing request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// If the token is invalid/expired, clear it and redirect to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

// ---- Auth ----
export const registerUser = (data) => api.post("/auth/register", data);
export const loginUser = (data) => api.post("/auth/login", data);
export const getProfile = () => api.get("/auth/me");

// ---- Products ----
export const createProduct = (data) => api.post("/products", data);
export const getMyProducts = () => api.get("/products");
export const getProductById = (id) => api.get(`/products/${id}`);
export const updateProduct = (id, data) => api.put(`/products/${id}`, data);
export const deleteProduct = (id) => api.delete(`/products/${id}`);

// ---- Buyers ----
export const getAllBuyers = (params) => api.get("/buyers", { params });
export const getMatchingBuyers = (productId) => api.get(`/buyers/match/${productId}`);
export const addBuyer = (data) => api.post("/buyers", data);

// ---- Emails ----
export const sendProductEmail = (data) => api.post("/emails/send", data);
export const getEmailLogs = () => api.get("/emails/logs");

export default api;
