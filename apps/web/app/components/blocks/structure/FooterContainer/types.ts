import type { Block } from '@plentymarkets/shop-api';

export interface FooterContainerColors {
  background: string;
  text: string;
  linkColor?: string;
}

export type FooterContainerBlock = Block & {
  name: 'FooterContainer';
  type: 'structure';
  content: Block[];
  configuration?: {
    visible: boolean;
    colors?: FooterContainerColors;
  };
};

export type FooterContainerProps = {
  content: Block[];
  configuration?: {
    visible: boolean;
    colors?: FooterContainerColors;
  };
};
