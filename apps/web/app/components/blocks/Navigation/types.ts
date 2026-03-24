export type SpacingSettings = {
  paddingTop?: number;
  paddingBottom?: number;
  paddingLeft?: number;
  paddingRight?: number;
};

export type TextSettings = {
  textAlignment?: 'left' | 'center' | 'right';
};

export type ColorSettings = {
  backgroundColor?: string;
  textColor?: string;
  hoverBackgroundColor?: string;
};

export type NavigationContent = {
  layout: SpacingSettings;
  text: TextSettings;
  color: ColorSettings;
};

export type NavigationProps = {
  name: string;
  type: string;
  content: NavigationContent;
  configuration?: object;
  index?: number;
  meta: {
    uuid: string;
  };
};

export type NavigationFormProps = {
  uuid?: string;
};
