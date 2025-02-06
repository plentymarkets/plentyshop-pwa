export type NewsletterSubscribeProps = {
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
};

export type NewsletterSubscribeProps2 = {
  text: {
    bgColor: string;
    title: string;
    htmlDescription: string;
  };
  input: {
    displayNameInput: boolean;
    nameIsRequired: boolean;
  };
  button: {
    label: string;
  };
};
