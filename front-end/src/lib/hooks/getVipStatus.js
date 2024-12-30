import appSettings from "../../settings/appSettings";
import axios from "../axios";

export const getVipStatus = () => {
  axios
    .get(`${appSettings.API_PROXY}/users/vip-status`)
    .then((resp) => {
      return resp?.data ?? null;
    })
    .catch((err) => {
      return null;
    });
};
