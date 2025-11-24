export default defineNuxtRouteMiddleware(async ({ query }) => {
  if (query.ActionCall === 'WebActionConfirmNewsletter' && import.meta.client) {
    const { confirmEmail } = useNewsletterConfirmation();
    const { send } = useNotification();

    if (query.newsletterEmailId && query.authString) {
      const response = await confirmEmail(query.newsletterEmailId.toString(), query.authString.toString());
      if (response && response.data) {
        send({
          message: t('emailConfirmation.newsletterOptInMessage'),
          type: 'positive',
          persist: true,
        });
      } else {
        send({
          message: t('emailConfirmation.newsletterOptInMessageError'),
          type: 'negative',
        });
      }
    }
  }
});
