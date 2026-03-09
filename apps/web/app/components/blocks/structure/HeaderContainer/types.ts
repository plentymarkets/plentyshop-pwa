import type { Block } from '@plentymarkets/shop-api';

export type HeaderContainerBlock = Block & {
  name: 'HeaderContainer';
  type: 'structure';
  content: Block[] | readonly Block[];
};

export type HeaderContainerProps = {
  block: HeaderContainerBlock;
};
