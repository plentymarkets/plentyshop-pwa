export default defineNuxtRouteMiddleware(async ({ query }) => {
  if (query.ActionCall !== 'WebActionConfirmNewsletter') return;

  const newsletterEmailId = query.newsletterEmailId?.toString();
  const authString = query.authString?.toString();

  if (!newsletterEmailId || !authString) return;

  const { confirmEmail } = useNewsletterConfirmation();
  const { send } = useNotification();

  const response = await confirmEmail(newsletterEmailId, authString);
  const success = response?.data;

  send({
    message: t(
      success
        ? 'newsletter.confirmation.newsletterOptInMessage'
        : 'newsletter.confirmation.newsletterOptInMessageError',
    ),
    type: success ? 'positive' : 'negative',
    persist: success ? true : undefined,
  });
});
