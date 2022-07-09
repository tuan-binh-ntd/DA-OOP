export interface Notification {
    id: string;
    content: string;
    appUserId: string;
    createDate: Date;
    isRead: boolean;
    projectId?: string;
    tasksId?: string;
}
