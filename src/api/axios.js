import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
});

api.interceptors.request.use((config) => {
  const isAuthRoute = config.url.startsWith("/auth/");

  const token = localStorage.getItem("token");

  if (token && !isAuthRoute) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Important fix:
  // Do not override multipart/form-data

  if (!(config.data instanceof FormData)) {
    config.headers["Content-Type"] = "application/json";
  }

  return config;
});

api.interceptors.response.use(
  (response) => {
    return response;
  },

  (error) => {
    const isAuthRoute = error.config?.url?.startsWith("/auth/");

    // Only treat 401 as "session expired" for authenticated (non-auth) API
    // calls. A 401 from /auth/login, /auth/forgot-password, or
    // /auth/reset-password is a normal business-logic response (bad
    // credentials, invalid/expired/reused token, etc.) that the calling
    // page's own catch block needs to show to the user — it must not
    // trigger a hard redirect that wipes the toast before it's readable.
    if (error.response?.status === 401 && !isAuthRoute) {
      localStorage.clear();

      window.location.href = "/login";
    }

    return Promise.reject(error);
  },
);

export default api;