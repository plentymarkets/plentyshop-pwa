import type { Block } from '@plentymarkets/shop-api';

type BlockActionOptions = {
  isEditable?: boolean;
  isMovable?: boolean;
  isDeletable?: boolean;
  classes?: string[];
};

export interface BlockActionsProps {
  index: number;
  block: Block;
  actions?: BlockActionOptions;
}
