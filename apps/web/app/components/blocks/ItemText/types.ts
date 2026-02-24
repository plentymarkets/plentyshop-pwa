export type ItemTextProps = {
  name?: string;
  type?: string;
  content: ItemTextContent;
  configuration?: object;
  index?: number;
  meta: {
    uuid: string;
  };
};

export type ItemTextContent = {
  text: {
    title: string;
  };
  layout: {
    displayAsCollapsable: boolean;
    initiallyCollapsed: boolean;
    paddingTop?: number;
    paddingBottom?: number;
    paddingLeft?: number;
    paddingRight?: number;
    fullWidth?: boolean;
  };
};

export type ItemTextFormProps = {
  uuid?: string;
};
export type TextAlignX = 'left' | 'center' | 'right';
export type TextAlignY = 'top' | 'center' | 'bottom';
export type ButtonVariant = 'primary' | 'secondary';
