export type TextCardProps = {
  name: string;
  type: string;
  content: TextCardContent;
  configuration?: object;
  index?: number;
  meta: {
    uuid: string;
  };
};

export type TextCardContent = {
  text: {
    pretitle?: string;
    title?: string;
    subtitle?: string;
    htmlDescription?: string;
    textAlignment?: 'left' | 'center' | 'right';
    color?: string;
  };
  button: {
    label?: string;
    link?: string;
    variant?: 'primary' | 'secondary';
  };
  layout: {
    backgroundColor?: string;
    paddingTop?: string;
    paddingBottom?: string;
    paddingLeft?: string;
    paddingRight?: string;
  };
};

export type TextCardFormProps = {
  uuid?: string;
};
