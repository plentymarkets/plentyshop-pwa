export type AlignX = 'left' | 'center' | 'right';
export type AlignY = 'top' | 'center' | 'bottom';
export type ButtonVariant = 'primary' | 'secondary';
export type FillMode = 'fill' | 'fit';
export type DisplayCategoryImage = 'off' | 'image-1' | 'image-2';
export type FootnoteAlign = 'left' | 'center' | 'right';
export type ItemCountPosition = 'left' | 'center' | 'right';
export type ContentAlignment = 'left' | 'center' | 'right';
export type AddToCartStyle = 'primary' | 'secondary';
export type WishlistSize = 'small' | 'large';
export type SourceType = 'cross_selling' | 'category';

export type EditorTarget = {
  text?: {
    align?: AlignX;
    justify?: AlignY;
    textAlignment?: AlignX;
    textOverlayAlignX?: AlignX;
    textOverlayAlignY?: AlignY;
  };
  button?: {
    variant?: ButtonVariant;
    alignment?: AlignX;
  };
  image?: {
    fillMode?: FillMode;
  };
  content?: {
    footnoteAlign?: FootnoteAlign;
  };
  source?: {
    type?: SourceType;
  };
  displayCategoryImage?: DisplayCategoryImage;
  itemCountPosition?: ItemCountPosition;
  contentAlignment?: ContentAlignment;
  addToCartStyle?: AddToCartStyle;
  wishlistSize?: WishlistSize;
};
