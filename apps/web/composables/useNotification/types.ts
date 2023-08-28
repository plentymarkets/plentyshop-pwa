export interface Notification {
    message: string
    action?: { text: string; onClick: (...args: any) => void }
    type: 'neutral' | 'positive' | 'secondary' | 'warning' | 'error'
    persist?: boolean
    id?: symbol
    dismiss?: () => void
}
export type SendNotification = (notification: Notification) => void;

export interface UseNotificationState {
    data: Notification[];
}

export interface UseNotification {
    data: Readonly<Ref<UseNotificationState['data']>>;
    send: SendNotification
}

export type UseNotificationReturn = () => UseNotification;
