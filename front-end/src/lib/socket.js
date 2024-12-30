import io from "socket.io-client";
import appSettings from "../settings/appSettings";

const socket = io(appSettings.SOCKET_PROXY, {
  transports: ["websocket"],
  autoConnect: false,
});

socket.on("connect", () => {
  console.log("connected");
});

socket.on("disconnect", () => {
  console.log("disconnected");
});

export default socket;
