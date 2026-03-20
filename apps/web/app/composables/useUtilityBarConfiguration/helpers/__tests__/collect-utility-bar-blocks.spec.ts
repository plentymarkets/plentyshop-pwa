import { describe, expect, it } from 'vitest';
import type { Block } from '@plentymarkets/shop-api';
import type { UtilityBarProps } from '~/components/blocks/UtilityBar/types';

import { collectUtilityBarBlocks } from '../collect-utility-bar-blocks';

const createUtilityBarBlock = (uuid: string): UtilityBarProps => ({
  name: 'UtilityBar',
  type: 'content',
  content: {
    layout: { paddingTop: 20, paddingBottom: 20, paddingLeft: 40, paddingRight: 40 },
    sectionOrder: { sections: ['logo', 'search', 'actions'] },
    sectionVisibility: { logo: true, search: true, actions: true },
    color: { iconColor: '#fff', backgroundColor: 'rgb(var(--colors-2-primary-500))' },
    logo: { logo: '' },
    search: { displayMode: 'full' },
    actions: {
      order: ['language', 'wishlist', 'cart', 'account'],
      visibility: { language: true, wishlist: true, cart: true, account: true },
    },
  },
  meta: { uuid },
});

describe('collectUtilityBarBlocks', () => {
  it('should return empty array when input is not an array', () => {
    const result = collectUtilityBarBlocks(undefined as unknown as Block[]);

    expect(result).toEqual([]);
  });

  it('should collect UtilityBar blocks at root level', () => {
    const utilityBar = createUtilityBarBlock('root-utility-bar');
    const otherBlock: Block = {
      name: 'HeroBanner',
      type: 'content',
      content: {},
      meta: { uuid: 'hero-uuid' },
    };

    const result = collectUtilityBarBlocks([otherBlock, utilityBar]);

    expect(result).toEqual([utilityBar]);
  });

  it('should collect UtilityBar blocks recursively from nested block content arrays', () => {
    const nestedUtilityBar = createUtilityBarBlock('nested-utility-bar');
    const rootUtilityBar = createUtilityBarBlock('root-utility-bar');

    const parentBlock: Block = {
      name: 'Container',
      type: 'content',
      content: [
        {
          name: 'TextBlock',
          type: 'content',
          content: { text: 'hello' },
          meta: { uuid: 'text-uuid' },
        },
        nestedUtilityBar,
      ],
      meta: { uuid: 'container-uuid' },
    };

    const result = collectUtilityBarBlocks([parentBlock, rootUtilityBar]);

    expect(result).toEqual([nestedUtilityBar, rootUtilityBar]);
  });

  it('should skip invalid candidates and continue collecting matches', () => {
    const utilityBar = createUtilityBarBlock('valid-utility-bar');
    const noisyInput = [null, undefined, 'invalid', 42, utilityBar] as unknown as Block[];

    const result = collectUtilityBarBlocks(noisyInput);

    expect(result).toEqual([utilityBar]);
  });
});
