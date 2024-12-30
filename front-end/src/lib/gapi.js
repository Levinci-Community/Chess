import { gapi } from "gapi-script";

export const initializeGapi = () => {
  const initializeGapiClient = () => {
    gapi.client.init({
      clientId:
        "792034127875-ia2do320uupm2vvi5amm83b8kkbr9l2q.apps.googleusercontent.com",
      scope: "",
    });
  };

  gapi.load("client:auth2", initializeGapiClient);
};
