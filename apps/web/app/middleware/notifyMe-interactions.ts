export default defineNuxtRouteMiddleware(async ({ query }) => {
  if (import.meta.client) {
    const { send } = useNotification();

    if (query.ActionCall === 'WebActionConfirmNotifyMe' && query.token) {
      const { confirmNotifyMe } = useNotifyMe();

      const data = await confirmNotifyMe({ token: query.token.toString() });

      if (data) {
        send({
          message: t('notifyMe.notifyMeOptInMessage'),
          type: 'positive',
          persist: true,
        });
      } else {
        send({
          message: t('notifyMe.notifyMeOptInMessageError'),
          type: 'negative',
        });
      }
    }

    if (query.ActionCall === 'WebActionUnsubscribeNotifyMe' && query.token) {
      const { unsubscribeNotifyMe } = useNotifyMe();

      const data = await unsubscribeNotifyMe({ token: query.token.toString() });

      if (data) {
        send({
          message: t('notifyMe.notifyMeUnsubscribeMessage'),
          type: 'positive',
          persist: true,
        });
      } else {
        send({
          message: t('notifyMe.notifyMeUnsubscribeMessageError'),
          type: 'negative',
        });
      }
    }
  }
});
