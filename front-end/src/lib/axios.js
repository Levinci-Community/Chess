import axios from "axios";
import appSettings from "../settings/appSettings";
import {
  getAccessToken,
  getAccessTokenExpiry,
  getRefreshToken,
  setAccessToken,
} from "./auth";

const PUBLIC_ROUTES = ["refresh", "login", "register"];

const refreshAccessToken = async (refreshToken) => {
  try {
    const response = await axios.post(
      `${appSettings.API_PROXY}/refresh`,
      null,
      {
        headers: { Authorization: `Bearer ${refreshToken}` },
      },
    );
    const newAccessToken = response.data.access_token;
    return newAccessToken;
  } catch (error) {
    window.location.href = "/logout";
    throw error;
  }
};

axios.interceptors.request.use(
  async (config) => {
    const paths = config.url.split("/") ?? ["/"];
    const route = paths[paths.length - 1];
    if (PUBLIC_ROUTES.includes(route)) {
      return config;
    }
    const accessToken = getAccessToken();
    const accessTokenExpiry = getAccessTokenExpiry();
    if (
      accessToken &&
      accessTokenExpiry &&
      Date.now() < Date.parse(accessTokenExpiry)
    ) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    } else {
      const refreshToken = getRefreshToken();
      if (!accessToken && !refreshToken) {
        return config;
      } else if (refreshToken) {
        try {
          const newAccessToken = await refreshAccessToken(refreshToken);
          config.headers.Authorization = `Bearer ${newAccessToken}`;
          setAccessToken(newAccessToken);
        } catch (refreshError) {
          throw refreshError;
        }
      } else {
        throw new Error("Refresh token not found");
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      const refreshToken = getRefreshToken();
      if (refreshToken) {
        try {
          const newAccessToken = await refreshAccessToken(refreshToken);
          setAccessToken(newAccessToken);
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return axios(originalRequest);
        } catch (refreshError) {
          window.location.href = "/logout";
          throw refreshError;
        }
      } else {
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
          throw new Error("Refresh token not found");
        }
        throw new Error("Login Fail");
      }
    }
    return Promise.reject(error);
  },
);

export default axios;
