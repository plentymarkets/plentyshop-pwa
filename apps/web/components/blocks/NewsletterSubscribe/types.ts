export type NewsletterSubscribeProps = {
  name: string;
  type: string;
  content: NewsletterSubscribeContent;
  configuration?: object;
  index?: number;
  meta: {
    uuid: string;
  };
};
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
  layout: {
    marginTop?: number;
    marginBottom?: number;
    marginLeft?: number;
    marginRight?: number;
  };
};

export type NewsletterFormProps = {
  uuid?: string;
};
