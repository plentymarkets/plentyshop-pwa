import type { BlockProps, PaddingLayout } from '~/types/blocks';

export type ProductLegalInformationProps = BlockProps<ProductLegalInformationContent>;

export type ProductLegalInformationContent = {
  text: {
    title: string;
    linkText: string;
  };
  layout: PaddingLayout;
};
