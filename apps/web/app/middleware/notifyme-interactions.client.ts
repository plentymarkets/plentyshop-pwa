export default defineNuxtRouteMiddleware(async ({ query }) => {
  const actionCall = query.ActionCall;
  const token = query.token?.toString();

  if (!actionCall || !token) return;

  if (actionCall === 'WebActionConfirmNotifyMe') {
    const { confirmNotifyMe } = useNotifyMe();
    const { send } = useNotification();

    const data = await confirmNotifyMe({ token });

    send({
      message: t(data ? 'notifyMe.notifyMeOptInMessage' : 'notifyMe.notifyMeOptInMessageError'),
      type: data ? 'positive' : 'negative',
      persist: data ? true : undefined,
    });
  } else if (actionCall === 'WebActionUnsubscribeNotifyMe') {
    const { unsubscribeNotifyMe } = useNotifyMe();
    const { send } = useNotification();

    const data = await unsubscribeNotifyMe({ token });

    send({
      message: t(data ? 'notifyMe.notifyMeUnsubscribeMessage' : 'notifyMe.notifyMeUnsubscribeMessageError'),
      type: data ? 'positive' : 'negative',
      persist: data ? true : undefined,
    });
  }
});
