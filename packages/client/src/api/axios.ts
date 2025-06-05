import axios from "axios";

const baseURL = process.env.REACT_APP_API_URL || "http://localhost:4000/api";

const api = axios.create({ baseURL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;
    if (err.response?.status === 401 && !original._retry) {
      original._retry = true;
      const rt = localStorage.getItem("refreshToken");
      if (rt) {
        try {
          const r = await axios.post(`${baseURL}/refresh`, {
            refreshToken: rt,
          });
          const newAccess = r.data.accessToken;
          localStorage.setItem("accessToken", newAccess);
          if (original.headers) original.headers.Authorization = `Bearer ${newAccess}`;
          return api(original);
        } catch (refreshErr) {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          window.location.href = "/login";
          return Promise.reject(refreshErr);
        }
      }
    }
    return Promise.reject(err);
  }
);

export default api;