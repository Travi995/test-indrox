import axios from "axios";
import { AxiosError } from "axios";
import { isTokenExpired } from "../utils/jwt";
import { useAuthStore } from "../stores";

export const http = axios.create({
  baseURL: "http://localhost:3001",
  timeout: 10_000,
});

http.interceptors.request.use((config) => {
  const { token, logout } = useAuthStore.getState();
  if (!token) return config;

  if (isTokenExpired(token)) {
    logout();
    return Promise.reject(new AxiosError("Session expired", "ERR_SESSION_EXPIRED", config));
  }

  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const { logout } = useAuthStore.getState();
      logout();
    }
    return Promise.reject(error);
  },
);
