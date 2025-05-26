import axios from "axios";

const api = axios.create({ baseURL: "http://localhost:4000/api" });

api.interceptors.request.use(config => {
  const token = localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  res => res,
  async err => {
    const original = err.config;
    if (err.response?.status === 401 && !original._retry) {
      original._retry = true;
      const rt = localStorage.getItem("refreshToken");
      if (rt) {
        const r = await axios.post("http://localhost:4000/api/refresh", {
          refreshToken: rt,
        });
        const newAccess = r.data.accessToken;
        localStorage.setItem("accessToken", newAccess);
        original.headers.Authorization = `Bearer ${newAccess}`;
        return api(original);
      }
    }
    return Promise.reject(err);
  }
);

export default api;