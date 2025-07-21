import axios from "axios";

const instance = axios.create({
  baseURL:  "https://snapauction.onrender.com/api/", // "https://portfolio-rkfu.onrender.com/project/snapauction/api/", // Update to your actual backend port
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error(`[API] ${error.config.method?.toUpperCase()} ${error.config.url} failed:`, error.response.data?.message || error.message);
    } else {
      console.error("[API] Network or CORS error:", error.message);
    }
    return Promise.reject(error);
  }
);

export default instance;
