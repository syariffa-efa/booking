import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  if (typeof document !== "undefined") {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];

    console.log("TOKEN DIKIRIM:", token); 

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});