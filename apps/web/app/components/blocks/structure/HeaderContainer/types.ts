import type { Block } from '@plentymarkets/shop-api';

export interface HeaderSection {
  identifier: string;
  type: string;
  enabled: boolean;
  order: number;
}

export interface HeaderContainerContent {
  sections: ReadonlyArray<HeaderSection>;
}

export type HeaderContainerBlock = Block & {
  name: 'HeaderContainer';
  type: 'structure';
  content: HeaderContainerContent;
};

export type HeaderContainerProps = {
  block: HeaderContainerBlock;
};
