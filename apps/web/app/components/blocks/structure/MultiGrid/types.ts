import type { Block } from '@plentymarkets/shop-api';

interface MultiGridLayout {
  marginTop?: number;
  marginBottom?: number;
  marginLeft?: number;
  marginRight?: number;
  
  // ADDED PADDING HERE
  paddingTop?: number;
  paddingBottom?: number;
  paddingLeft?: number;
  paddingRight?: number;

  backgroundColor?: string;
  fullWidth?: boolean;
  fullWidthBackground?: boolean;
  gap?: string;

  mobileCols?: number;
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
      marginLeft?: number;
      marginRight?: number;
      
      // ADDED PADDING HERE TOO
      paddingTop?: number;
      paddingBottom?: number;
      paddingLeft?: number;
      paddingRight?: number;

      backgroundColor?: string;
      fullWidth?: boolean;
      fullWidthBackground?: boolean;
      
      // 🚨 ADD THIS HERE TOO!
      mobileCols?: number;
    };
  };
};