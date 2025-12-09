import type { Block } from '@plentymarkets/shop-api';
import type { BlockProps } from '~/types/blocks';

interface MultiGridLayout {
  marginTop?: number;
  marginBottom?: number;
  marginLeft?: number;
  marginRight?: number;
  backgroundColor?: string;
  gap?: string;
  fullWidth?: boolean;
}

interface MultiGridConfiguration {
  columnWidths: number[];
  layout?: MultiGridLayout;
  sticky?: number[];
}

/**
 * MultiGrid structure block that contains an array of child blocks.
 * Uses BlockProps with Block[] as content type for recursive nesting.
 */
export type MultiGridProps = BlockProps<Block[], MultiGridConfiguration>;

export type EmptyGridBlockProps = {
  name: string;
  type: string;
  content: [];
  meta: {
    uuid: string;
  };
};

export type AlignableBlock = Block & {
  content?: {
    imageAlignment?: string;
    alignment?: string;
    [key: string]: unknown;
  };
};

export type ColumnBlock = Block & {
  content?: Block[];
  configuration: {
    columnWidths: number[];
    sticky?: number[];
    layout?: {
      gap: string;
      marginTop?: number;
      marginBottom?: number;
      marginLeft?: number;
      marginRight?: number;
      backgroundColor?: string;
    };
  };
};
