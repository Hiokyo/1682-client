import { io } from "socket.io-client";

export const socket = io("https://server-1682.herokuapp.com", {
  autoConnect: false,
});
