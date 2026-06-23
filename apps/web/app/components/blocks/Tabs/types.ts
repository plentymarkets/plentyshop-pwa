import type { Block } from '@plentymarkets/shop-api';

export type TabsProps = {
  name: string;
  type: string;
  meta: {
    uuid: string;
  };
  configuration?: {
    layout: {
      fullWidth: boolean;
      showBorderUnderTabs: boolean;
      tabsAlignment: 'left' | 'center' | 'right';
    };
  };
  content: Block[];
};

export type TabsFormProps = {
  uuid?: string;
};