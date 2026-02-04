import type { Block } from '@plentymarkets/shop-api';

export interface HeaderLayout {
  backgroundColor?: string;
  sticky?: boolean;
  height?: string;
}

export interface HeaderConfiguration {
  layout?: HeaderLayout;
}

export type HeaderProps = {
  name?: string;
  type?: string;
  content?: Block[] | HeaderSettings;
  configuration?: HeaderConfiguration;
  meta?: {
    uuid: string;
  };
  index?: number;
};

export interface HeaderSettings {
  layout?: HeaderLayout;
  blocks?: Block[];
}
