import { Server } from "socket.io";
import { io, usersMapSocket } from "../config/socketConfig.js";

class SocketIoService {
  constructor(private io: Server) {}

  emitToUser(userId: string, event: string, data: any) {
    const socketId = usersMapSocket[userId];
    if (socketId) {
      this.io.to(socketId).emit(event, data);
    }
  }

  broadcast(event: string, data: any) {
    this.io.emit(event, data);
  }
}

export const socketIoService = new SocketIoService(io);
