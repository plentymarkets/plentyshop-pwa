import type { UtilityBarProps } from '~/components/blocks/UtilityBar/types';
import type { Block } from '@plentymarkets/shop-api';

export const collectUtilityBarBlocks = (blocks: Block[]): UtilityBarProps[] => {
  if (!Array.isArray(blocks)) {
    return [];
  }

  const matches: UtilityBarProps[] = [];

  for (const candidate of blocks) {
    if (!candidate || typeof candidate !== 'object') {
      continue;
    }

    const block = candidate as UtilityBarProps;
    if (block.name === 'UtilityBar') {
      matches.push(block);
    }

    if (Array.isArray(block.content)) {
      matches.push(...collectUtilityBarBlocks(block.content));
    }
  }

  return matches;
};
