import type { BlockProps, PaddingLayout } from '~/types/blocks';

export type CustomerReviewProps = BlockProps<CustomerReviewContent>;

export type CustomerReviewContent = {
  text: {
    title: string;
  };
  layout: PaddingLayout & {
    collapsible: boolean;
    initiallyCollapsed: boolean;
  };
};
