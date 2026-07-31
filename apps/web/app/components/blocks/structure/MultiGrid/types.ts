import type { Block } from '@plentymarkets/shop-api';

export interface GridCell {
  colIndex: number;
  span: number;
  hasContent: boolean;
  blockName?: string;
}

export interface GridRow {
  cells: GridCell[];
  free: number;
}

export interface DragState {
  colIndex: number;
  startX: number;
  startSpan: number;
  unitW: number;
}

interface MultiGridLayout {
  marginTop?: number;
  marginBottom?: number;
  backgroundColor?: string;
  gap?: string;
  fullWidth?: boolean;
  reverseOnMobile?: boolean;
  alignHeights?: boolean;
}

export interface MultiGridColumnConfig {
  columnWidths: number[];
  columnWidthsTablet?: number[];
  columnWidthsMobile?: number[];
}

export type MultiGridProps = {
  name: string;
  type: string;
  content: Block[];
  configuration: MultiGridColumnConfig & {
    layout?: MultiGridLayout;
    sticky?: number[];
  };
  meta: {
    uuid: string;
  };
  index?: number;
};

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
  configuration: MultiGridColumnConfig & {
    sticky?: number[];
    layout?: {
      gap: string;
      marginTop?: number;
      marginBottom?: number;
      backgroundColor?: string;
      fullWidth?: boolean;
      reverseOnMobile?: boolean;
      alignHeights?: boolean;
    };
  };
};

export type GapSize = 'None' | 'S' | 'M' | 'L' | 'XL';

export interface VisibleGridState {
  filteredToOriginal: number[];
  originalToFiltered: Record<number, number>;
  columnWidths: number[];
  blocks: Block[];
}
