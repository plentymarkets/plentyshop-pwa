import type { Block } from '@plentymarkets/shop-api';

export interface BlockLayout {
  fullWidth?: boolean;
  narrowContainer?: boolean;
  marginTop?: number;
  marginBottom?: number;
  marginLeft?: number;
  marginRight?: number;
  backgroundColor?: string;
  gap?: string;
}

export interface BlockWithLayout extends Block {
  layout?: BlockLayout;
  content: {
    layout?: BlockLayout;
    [key: string]: unknown;
  };
}

/**
 * Checks if a block has fullWidth enabled in its layout configuration.
 * Checks both block.layout and block.content.layout locations.
 */
export const hasFullWidthEnabled = (block: Block): boolean => {
  const blockWithLayout = block as BlockWithLayout;
  return blockWithLayout.layout?.fullWidth ?? blockWithLayout.content?.layout?.fullWidth ?? false;
};

/**
 * Gets the layout configuration from a block.
 * Prioritizes block.content.layout over block.layout.
 */
// export const getBlockLayout = (block: Block): BlockLayout | undefined => {
//   const blockWithLayout = block as BlockWithLayout;
//   return blockWithLayout.content?.layout ?? blockWithLayout.layout;
// };

/**
 * Checks if a block has narrowContainer enabled.
 */
// export const hasNarrowContainer = (block: Block): boolean => {
//   const blockWithLayout = block as BlockWithLayout;
//   return blockWithLayout.layout?.narrowContainer ?? blockWithLayout.content?.layout?.narrowContainer ?? false;
// };
