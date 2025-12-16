import { computed, type ComputedRef } from 'vue';
import type { Block } from '@plentymarkets/shop-api';
import { useSiteSettings } from '~/composables/useSiteSettings/useSiteSettings';
import { resolveBlockLayoutRule } from '~/configuration/block-layout.config';

const getFullWidthFromObject = (obj: unknown): boolean | undefined => {
  return getNestedValue<boolean>(obj, ['layout', 'fullWidth'], 'boolean');
};

const hasFullWidth = (block: Block): boolean => {
  const explicit =
    block.type === 'content' ? getFullWidthFromObject(block.content) : getFullWidthFromObject(block.configuration);
  if (explicit !== undefined) return explicit;
  const rule = resolveBlockLayoutRule(block.name);
  return rule.defaultFullWidth;
};

export const useBlockClasses = (block: Block): ComputedRef<Record<string, boolean>> => {
  const { getSetting } = useSiteSettings('horizontalBlockSize');

  return computed(() => {
    const fullWidth = hasFullWidth(block);
    const rule = resolveBlockLayoutRule(block.name);
    const horizontalSpacing = getSetting();

    return buildBlockClasses(block, {
      fullWidth,
      rule,
      horizontalSpacing,
    });
  });
};
