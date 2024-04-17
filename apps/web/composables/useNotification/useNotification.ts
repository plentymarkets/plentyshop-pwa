import type { UseNotificationState, UseNotificationReturn, Notification } from './types';

const maxVisibleNotifications = 5;
const dismissTimeout = 3000;

/**
 * @description Composable to display ui notifications
 * @return UseNotificationReturn
 * @example
 * ``` ts
 * const { data, send } = useNotification();
 * ```
 */
export const useNotification: UseNotificationReturn = () => {
  const state = useState<UseNotificationState>(`useNotification`, () => ({
    data: [],
  }));

  /**
   * @description method to display a ui notification
   * @param notification { Notification }
   * @example
   * ``` ts
   *  send({
   *     message: 'Test alert error with a longer message',
   *     type: 'negative',
   *    persist: true,
   *     action: {
   *       text: 'action',
   *       onClick: () => {},
   *    },
   *  });
   * ```
   */
  const send = (notification: Notification) => {
    const id = Symbol();

    const dismiss = () => {
      const index = state.value.data.findIndex((notification) => notification.id === id);

      if (index !== -1) state.value.data.splice(index, 1);
    };

    const dismissibleNotification = {
      ...notification,
      id,
      dismiss,
    };

    state.value.data.push(dismissibleNotification);
    if (state.value.data.length > maxVisibleNotifications) state.value.data.shift();

    if (!notification.persist && notification.type !== 'negative') {
      setTimeout(dismiss, notification.dismissTimeout || dismissTimeout);
    }
  };

  const clear = () => {
    state.value.data = [];
  };

  return {
    send,
    clear,
    ...toRefs(state.value),
  };
};
