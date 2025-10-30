export default defineNuxtRouteMiddleware(async ({ query }) => {
  if (import.meta.client) {
    const { send } = useNotification();
    const { $i18n } = useNuxtApp();

    if (query.ActionCall === 'WebActionConfirmNotifyMe' && query.token) {
      const { confirmNotifyMe } = useNotifyMe();

      const response = await confirmNotifyMe({ token: query.token.toString() });

      if (response && response.success) {
        send({
          message: $i18n.t('notifyMe.notifyMeOptInMessage'),
          type: 'positive',
          persist: true,
        });
      } else {
        send({
          message: $i18n.t('notifyMe.notifyMeOptInMessageError'),
          type: 'negative',
        });
      }
    }

    if (query.ActionCall === 'WebActionUnsubscribeNotifyMe' && query.token) {
      const { unsubscribeNotifyMe } = useNotifyMe();

      const response = await unsubscribeNotifyMe({ token: query.token.toString() });

      if (response && response.success) {
        send({
          message: $i18n.t('notifyMe.notifyMeUnsubscribeMessage'),
          type: 'positive',
          persist: true,
        });
      } else {
        send({
          message: $i18n.t('notifyMe.notifyMeUnsubscribeMessageError'),
          type: 'negative',
        });
      }
    }
  }
});
