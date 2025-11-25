export const useEditModeNotification = (disableActions: Ref<boolean>) => {
  const { send } = useNotification();
  const notificationShown = ref(false);
  const prevDisableActions = ref(disableActions.value);

  watch(
    disableActions,
    (actionsDisabled, prevDisabled) => {
      if (actionsDisabled && !prevDisabled && !notificationShown.value) {
        send({
          type: 'warning',
          message: `<strong>Example Data in Edit Mode</strong><br>
            Fields without product data are shown with example data for editing purposes. To view only real data, please click the preview link.`,
        });
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
