import type { Block } from '@plentymarkets/shop-api';

export type TabsAlignment = 'left' | 'center' | 'right';

export type TabStyle = 'underline' | 'pills' | 'vertical';

export type TabsStructureConfiguration = {
  visible?: boolean;
  layout?: {
    fullWidth?: boolean;
    tabStyle?: TabStyle;
    showBorderUnderTabs?: boolean;
    tabsAlignment?: TabsAlignment;
  };
};

export type TabsProps = {
  name: string;
  type: string;
  meta: {
    uuid: string;
  };
  configuration?: TabsStructureConfiguration;
  content: Block[];
};

export type TabsFormProps = {
  uuid?: string;
};
