export type PictureProps = {
  src: string,
  sources: { srcset: string, format: string }[],
  alt: string, 
  cssClass?: string,
  height?: string,
  width?: string,
  preload?: boolean
};
