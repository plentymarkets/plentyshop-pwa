import type { Block } from '@plentymarkets/shop-api';

export interface HeaderContent {
  backgroundColor?: string;
  iconColor?: string;
}

export type HeaderProps = {
  name: string;
  type: string;
  content: HeaderContent;
  meta: {
    uuid: string;
  };
};

export type HeaderBlock = Block & {
  name: 'Header';
  type: 'content';
  content: HeaderContent;
};

export interface HeaderFormProps {
  uuid?: string;
}
