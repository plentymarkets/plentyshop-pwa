import type { BlockProps } from '~/types/blocks';

export type NewsletterSubscribeProps = BlockProps<NewsletterSubscribeContent>;
export type NewsletterSubscribeContent = {
  index?: number;
  text: {
    bgColor?: string;
    title?: string;
    htmlDescription?: string;
  };
  input: {
    displayNameInput?: boolean;
    nameIsRequired?: boolean;
  };
  button: {
    label?: string;
  };
  settings: {
    emailFolderId: number;
  };
  layout?: {
    fullWidth?: boolean;
  };
};
