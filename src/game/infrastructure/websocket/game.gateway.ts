import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WebSocketGatewayPort } from '../../application/ports/websocket-gateway.port';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: '/game',
})
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect, WebSocketGatewayPort {
  @WebSocketServer()
  server: Server;

  private userSockets = new Map<string, string>();

  handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;
    if (userId) {
      this.userSockets.set(userId, client.id);
      client.join(`user_${userId}`);
    }
  }

  handleDisconnect(client: Socket) {
    const userId = Array.from(this.userSockets.entries())
      .find(([, socketId]) => socketId === client.id)?.[0];
    
    if (userId) {
      this.userSockets.delete(userId);
    }
  }

  @SubscribeMessage('join_game')
  handleJoinGame(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { gameId: string },
  ) {
    client.join(`game_${data.gameId}`);
    client.emit('joined_game', { gameId: data.gameId });
  }

  @SubscribeMessage('leave_game')
  handleLeaveGame(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { gameId: string },
  ) {
    client.leave(`game_${data.gameId}`);
    client.emit('left_game', { gameId: data.gameId });
  }

  emitToRoom(roomId: string, event: string, data: any): void {
    this.server.to(`game_${roomId}`).emit(event, data);
  }

  emitToUser(userId: string, event: string, data: any): void {
    this.server.to(`user_${userId}`).emit(event, data);
  }

  joinRoom(userId: string, roomId: string): void {
    const socketId = this.userSockets.get(userId);
    if (socketId) {
      this.server.sockets.sockets.get(socketId)?.join(`game_${roomId}`);
    }
  }

  leaveRoom(userId: string, roomId: string): void {
    const socketId = this.userSockets.get(userId);
    if (socketId) {
      this.server.sockets.sockets.get(socketId)?.leave(`game_${roomId}`);
    }
  }
}