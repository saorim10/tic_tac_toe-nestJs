export interface WebSocketGatewayPort {
  emitToRoom(roomId: string, event: string, data: any): void;
  emitToUser(userId: string, event: string, data: any): void;
  joinRoom(userId: string, roomId: string): void;
  leaveRoom(userId: string, roomId: string): void;
}