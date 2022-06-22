export interface Message {
  id: string;
  taskId: string;
  senderId: string;
  senderUserName: string;
  recipientId: string;
  recipientUserName: string;
  content: string;
  dateRead?: Date;
  messageSent: Date;
}
