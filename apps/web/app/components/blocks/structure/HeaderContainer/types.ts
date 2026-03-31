import type { Block } from '@plentymarkets/shop-api';

export type HeaderContainerBlock = Block & {
  name: 'HeaderContainer';
  type: 'structure';
  content: Block[];
  configuration?: {
    visible: boolean;
    layout?: {
      sticky?: boolean;
    };
  };
};

export type HeaderContainerProps = {
  block?: HeaderContainerBlock;
  content: Block[];
};
