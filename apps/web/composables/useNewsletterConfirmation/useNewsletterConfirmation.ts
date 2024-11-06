import { EmailConfirmationOptin, UseNewsletterConfirmationReturn } from '~/composables/useNewsletterConfirmation/types';

export const useNewsletterConfirmation: UseNewsletterConfirmationReturn = () => {
  const confirmEmail: EmailConfirmationOptin = async (newsletterEmailId, authString) => {
    return await useSdk().plentysystems.doEmailConfirmation({
      newsletterEmailId,
      authString,
    });
  };

  return {
    confirmEmail,
  };
};
