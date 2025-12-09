import type { BlockProps, PaddingLayout } from '~/types/blocks';

export type TechnicalDataProps = BlockProps<TechnicalDataContent>;

export type TechnicalDataContent = {
  text: {
    title: string;
  };
  layout: Partial<PaddingLayout> & {
    displayAsCollapsable: boolean;
    initiallyCollapsed: boolean;
  };
};

export type TechnicalDataFormProps = {
  uuid?: string;
};
