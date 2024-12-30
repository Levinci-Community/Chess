import { useLocation } from "react-router-dom";

export const useCurrentPath = () => {
  const location = useLocation();
  const path = location.pathname.split("/");
  return path;
};
