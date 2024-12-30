import appSettings from "../settings/appSettings";

export const setAccessToken = (access_token) => {
  localStorage.setItem("access_token", access_token);
  const now = new Date();
  const time = now.getTime();
  const expireTime = time + 24 * 60 * 60 * 1000;
  now.setTime(expireTime);
  localStorage.setItem("access_token_expiry", now.toUTCString());
};

export const getAccessTokenExpiry = () => {
  return localStorage.getItem("access_token_expiry");
};

export const setRefreshToken = (refresh_token) => {
  localStorage.setItem("refresh_token", refresh_token);
};

export const getAccessToken = () => {
  return localStorage.getItem("access_token");
};

export const getRefreshToken = () => {
  return localStorage.getItem("refresh_token");
};

export const clearTokens = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
};

export const setUserData = (user) => {
  localStorage.setItem("user", JSON.stringify(user));
};

export const getUserData = () => {
  const user_data = JSON.parse(localStorage.getItem("user"));
  if (!user_data) return null;
  return {
    ...user_data,
    avatar: `${appSettings.API_PROXY}/images/user-${user_data?.id ?? ""}`,
  };
};

export const clearUserData = () => {
  localStorage.removeItem("user");
};
