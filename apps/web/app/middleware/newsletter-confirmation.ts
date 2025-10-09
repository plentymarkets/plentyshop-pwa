export default defineNuxtRouteMiddleware(async ({ query }) => {
  if (query.ActionCall === 'WebActionConfirmNewsletter' && import.meta.client) {
    const { confirmEmail } = useNewsletterConfirmation();
    const { send } = useNotification();
    const { $i18n } = useNuxtApp();

    if (query.newsletterEmailId && query.authString) {
      const response = await confirmEmail(query.newsletterEmailId.toString(), query.authString.toString());
      if (response && response.data) {
        send({
          message: $i18n.t('emailConfirmation.newsletterOptInMessage'),
          type: 'positive',
          persist: true,
        });
      } else {
        send({
          message: $i18n.t('emailConfirmation.newsletterOptInMessageError'),
          type: 'negative',
        });
      }
    }
  }
});
