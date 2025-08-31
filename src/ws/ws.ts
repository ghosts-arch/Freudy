import { Server } from "socket.io";
import { Server as HttpServer } from "http";

let io: Server;
export const setupWebSocket = (server: HttpServer): Server => {
  io = new Server(server, {
    cors: {
      origin: "*http://localhost:3000",
      methods: ["GET", "POST"],
    },
  });
  io.on("connection", (socket) => {});
  return io;
};

export const getIo = (): Server => {
  if (!io) throw new Error("IO is not setup");
  return io;
};
