export interface Notification {
    id: number;
    type: 'withdrawal' | 'deposit' | 'transaction' | 'misc';
    message: string;
    date: Date;
}

export type NotificationId = Notification['id'];
