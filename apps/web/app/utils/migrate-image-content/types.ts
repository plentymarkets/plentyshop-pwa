export type OldImageContent = {
  index?: number;
  wideScreen?: string;
  desktop?: string;
  tablet?: string;
  mobile?: string;
  alt?: string;
  imageAlignment?: 'left' | 'right';
  brightness?: number;
  textOverlay?: string;
  textOverlayColor?: string;
  textOverlayAlignY?: 'top' | 'center' | 'bottom';
  textOverlayAlignX?: 'left' | 'center' | 'right';
  label?: string;
  link?: string;
  variant?: 'primary' | 'secondary';
};
