
export enum MessageType {
  USER = 'USER',
  SYSTEM = 'SYSTEM',
}

export interface ChatMessage {
  id: string;
  type: MessageType;
  nickname: string;
  message: string;
  timestamp: string;
}
