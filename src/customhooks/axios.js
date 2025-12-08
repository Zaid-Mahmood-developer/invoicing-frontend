import { api } from "./api";
import { refreshClient } from "./refresh";

api.interceptors.response.use(
  res => res,
  async err => {
    if (err.response?.status === 401 && !err.config._retry) {
      err.config._retry = true;

      try {
        const refreshRes = await refreshClient.get("/refresh");

        api.defaults.headers.common["Authorization"] =
          `Bearer ${refreshRes.data.accessToken}`;

        err.config.headers["Authorization"] =
          `Bearer ${refreshRes.data.accessToken}`;

        return api(err.config);
      } catch (refreshErr) {
        window.location.href = "/";
      }
    }
    return Promise.reject(err);
  }
);

export default api;
