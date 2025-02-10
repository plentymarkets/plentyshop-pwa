export interface Notification {
  message: string | string[];
  action?: { text: string; onClick: (...arguments_: Array<unknown>) => void };
  type: 'neutral' | 'positive' | 'secondary' | 'warning' | 'negative';
  persist?: boolean;
  id?: symbol;
  dismiss?: () => void;
  dismissTimeout?: number;
}
export type SendNotification = (notification: Notification) => void;
export type ClearNotification = () => void;

export interface UseNotificationState {
  data: Notification[];
}

export interface UseNotification {
  data: Readonly<Ref<UseNotificationState['data']>>;
  send: SendNotification;
  clear: ClearNotification;
}

export type UseNotificationReturn = () => UseNotification;
