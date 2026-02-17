import { Server } from "socket.io";
import { io, usersMapSocket } from "../config/socketConfig.js";

class SocketIoService {
  constructor(private io: Server) {}

  emitToUser(userId: string, event: string, data: any) {
    const userSocketId = usersMapSocket[userId];
    if (userSocketId) {
      this.io.to(userSocketId.socketIds).emit(event, data);
    }
  }

  broadcast(event: string, data: any) {
    this.io.emit(event, data);
  }

  emitToCompany(companyId: number, event: string, data: any) {
    // Assuming you have a way to get all user IDs for a company
    const userIds = this.getUserIdsByCompanyId(companyId);
    userIds.forEach((userId) => {
      this.emitToUser(userId, event, data);
    });
  }

  private getUserIdsByCompanyId(companyId: number): string[] {
    // This is a placeholder. You should implement logic to fetch user IDs based on company ID.
    // For example, you might query your database or maintain an in-memory mapping.
    return [];
  }
}

export const socketIoService = new SocketIoService(io);
