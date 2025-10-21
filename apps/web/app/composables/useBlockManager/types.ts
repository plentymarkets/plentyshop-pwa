export type BlockPosition = 'top' | 'bottom' | 'inside';
export type RefCallback = (ref: Element | ComponentPublicInstance | null) => void;
export type ShowBottomAddInGridOptions = {
  blockMetaUuid: string;
  columnLength?: number;
  blockName: string;
  isRowHovered: boolean;
  getBlockDepth: (uuid: string) => number;
};
