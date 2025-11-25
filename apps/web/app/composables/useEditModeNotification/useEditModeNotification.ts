import type { UseEditModeNotificationReturn } from './types';

export const useEditModeNotification = (disableActions: Ref<boolean>): UseEditModeNotificationReturn => {
  const notificationShown = ref(false);
  const prevDisableActions = ref(disableActions.value);

  watch(
    disableActions,
    (actionsDisabled, prevDisabled) => {
      if (actionsDisabled && !prevDisabled && !notificationShown.value) {
        sendFakeDataNotification();
        notificationShown.value = true;
      }
      prevDisableActions.value = actionsDisabled;
    },
    { immediate: true },
  );

  const resetNotification = () => {
    notificationShown.value = false;
  };

  return { notificationShown, resetNotification };
};
