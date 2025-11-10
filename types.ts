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

export type ActivityLogType = 'USER_JOIN' | 'USER_LEAVE' | 'MESSAGE_SENT';

export interface ActivityLog {
  type: ActivityLogType;
  timestamp: string;
  nickname: string;
  message?: string;
  socketId?: string;
}