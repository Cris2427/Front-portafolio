import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8081",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  const tipoToken = localStorage.getItem("tipoToken") || "Bearer";

  if (token) {
    config.headers.Authorization = `${tipoToken} ${token}`;
  }

  return config;
});

export default api;
