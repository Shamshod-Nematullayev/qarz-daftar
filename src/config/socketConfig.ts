import { Socket, Server } from "socket.io";
import http from "http";
import express from "express";
import jwt from "jsonwebtoken";
import app from "../app";
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    credentials: true,
  },
  path: "/socket.io",
});

const usersMapSocket: {
  [key: string]: {
    socketIds: string[];
    companyId: number;
  };
} = {};
io.on("connection", (socket: Socket) => {
  try {
    console.log("New socket connection:", socket.id);
    const decoded = jwt.verify(
      socket.handshake.query.accessToken as string,
      process.env.JWT_SECRET as string
    ) as {
      userId: string;
      companyId: number;
      username: string;
    };

    if (!usersMapSocket[decoded.userId])
      usersMapSocket[decoded.userId] = {
        socketIds: [],
        companyId: decoded.companyId,
      };
    usersMapSocket[decoded.userId].socketIds.push(socket.id);
    console.log({ usersMapSocket });

    socket.on("disconnect", () => {
      usersMapSocket[decoded.userId].socketIds = usersMapSocket[
        decoded.userId
      ].socketIds.filter((id) => id !== socket.id);
    });
  } catch (error: any) {
    console.error("Error during socket connection:", error);
    if ("message" in error) {
      console.error(error.message);
    }
  }
});

export { io, app, server, usersMapSocket };
