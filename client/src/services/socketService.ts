// src/services/socketService.ts
import { io, Socket } from "socket.io-client";

class SocketService {
  private socket: Socket | null = null;
  private static instance: SocketService;

  private constructor() {
    this.socket = io(process.env.NEXT_PUBLIC_API_BASE_URL || "", {
      transports: ["websocket"],
      autoConnect: false,
    });
  }

  public static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  public connect(token: string): void {
    if (!this.socket) return;

    this.socket.auth = { token };
    this.socket.connect();
  }

  public disconnect(): void {
    if (!this.socket) return;
    this.socket.disconnect();
  }

  public subscribeToMessages(callback: (message: any) => void): void {
    if (!this.socket) return;
    this.socket.on("new_message", callback);
  }

  public unsubscribeFromMessages(): void {
    if (!this.socket) return;
    this.socket.off("new_message");
  }

  public subscribeToChatUpdates(callback: (chat: any) => void): void {
    if (!this.socket) return;
    this.socket.on("chat_updated", callback);
  }

  public unsubscribeFromChatUpdates(): void {
    if (!this.socket) return;
    this.socket.off("chat_updated");
  }

  public subscribeToStatusUpdates(callback: (data: { userId: string; isOnline: boolean; lastSeen: Date | null }) => void): void {
    if (!this.socket) return;
    this.socket.on("user_status_changed", callback);
  }

  public unsubscribeFromStatusUpdates(): void {
    if (!this.socket) return;
    this.socket.off("user_status_changed");
  }

  public joinChatRoom(chatId: number): void {
    if (!this.socket) return;
    this.socket.emit("join_chat", { chatId });
  }

  public leaveChatRoom(chatId: number): void {
    if (!this.socket) return;
    this.socket.emit("leave_chat", { chatId });
  }

  public updateStatus(isOnline: boolean): void {
    if (!this.socket) return;
    this.socket.emit("update_status", { isOnline });
  }

  public onError(callback: (error: string) => void): void {
    if (!this.socket) return;
    this.socket.on("error", callback);
  }
}

export default SocketService;