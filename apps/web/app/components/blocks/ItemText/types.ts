import type { BlockProps, PaddingLayout } from '~/types/blocks';

export type ItemTextProps = BlockProps<ItemTextContent>;

export type ItemTextContent = {
  text: {
    title: string;
  };
  layout: Partial<PaddingLayout> & {
    displayAsCollapsable: boolean;
    initiallyCollapsed: boolean;
  };
};

export type ItemTextFormProps = {
  uuid?: string;
};
