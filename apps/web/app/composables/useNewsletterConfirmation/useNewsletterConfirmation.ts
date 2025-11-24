import type {
  EmailConfirmationOptin,
  UseNewsletterConfirmationReturn,
} from '~/composables/useNewsletterConfirmation/types';

const confirmEmail: EmailConfirmationOptin = async (newsletterEmailId, authString) => {
  try {
    return await useSdk().plentysystems.doEmailConfirmation({
      newsletterEmailId,
      authString,
    });
  } catch {
    return null;
  }
};

export const useNewsletterConfirmation: UseNewsletterConfirmationReturn = () => {
  return {
    confirmEmail,
  };
};
