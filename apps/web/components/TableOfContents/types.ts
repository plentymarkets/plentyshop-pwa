import type { Block } from '@plentymarkets/shop-api';

/**
 * Props for TableOfContents component
 */
export interface TableOfContentsProps {
  blocks?: Block[];
}

/**
 * Interface for block list item display
 */
export interface BlockListItem {
  name: string;
  uuid: string;
  type: 'structure' | 'content';
  depth: number;
  children?: BlockListItem[];
}
