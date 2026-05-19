import type { Block } from '@plentymarkets/shop-api';

export interface GridCell {
  colIndex: number;
  span: number;
  hasContent: boolean;
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
}

export type MultiGridProps = {
  name: string;
  type: string;
  content: Block[];
  configuration: {
    columnWidths: number[];
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
  configuration: {
    columnWidths: number[];
    sticky?: number[];
    layout?: {
      gap: string;
      marginTop?: number;
      marginBottom?: number;
      backgroundColor?: string;
      fullWidth?: boolean;
    };
  };
};

export type GapSize = 'None' | 'S' | 'M' | 'L' | 'XL';
