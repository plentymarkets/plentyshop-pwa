import { EmailConfirmationOptin, UseNewsletterConfirmationReturn } from '~/composables/useNewsletterConfirmation/types';

export const useNewsletterConfirmation: UseNewsletterConfirmationReturn = () => {
  // eslint-disable-next-line unicorn/consistent-function-scoping
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
