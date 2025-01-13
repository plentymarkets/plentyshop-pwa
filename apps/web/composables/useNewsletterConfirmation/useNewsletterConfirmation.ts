import type {
  EmailConfirmationOptin,
  UseNewsletterConfirmationReturn,
} from '~/composables/useNewsletterConfirmation/types';

const confirmEmail: EmailConfirmationOptin = async (newsletterEmailId, authString) => {
  return await useSdk().plentysystems.doEmailConfirmation({
    newsletterEmailId,
    authString,
  });
};

export const useNewsletterConfirmation: UseNewsletterConfirmationReturn = () => {
  return {
    confirmEmail,
  };
};
