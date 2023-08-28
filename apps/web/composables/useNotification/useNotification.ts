import { UseNotificationState, UseNotificationReturn, Notification } from './types';

const state = useState<UseNotificationState>(`useNotification`, () => ({
    data: []
  }));

const maxVisibleNotifications = 5;
const timeToLive = 3000;

export const useNotification: UseNotificationReturn = () => {
  const send = (notification: Notification) => {
    const id = Symbol();

    const dismiss = () => {
      const index = state.value.data.findIndex(notification => notification.id === id);

      if (index !== -1) state.value.data.splice(index, 1);
    };

    const newNotification = {
      ...notification,
      id,
      dismiss
    };

    state.value.data.push(newNotification);
    if (state.value.data.length > maxVisibleNotifications) state.value.data.shift();

    if (!notification.persist) {
      setTimeout(dismiss, timeToLive);
    }
  };

  return {
    send,
    ...toRefs(state.value)
  };
};

