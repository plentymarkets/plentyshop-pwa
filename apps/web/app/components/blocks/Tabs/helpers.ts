import type { Block } from '@plentymarkets/shop-api';

export const getTabLabel = (block: Block, index: number, fallbackPrefix: string): string => {
  const label = (block.configuration as { tabSettings?: { label?: string } } | undefined)?.tabSettings?.label?.trim();
  if (label) return label;

  const content = block.content as { text?: { title?: unknown } } | undefined;
  const title = content?.text?.title;
  if (typeof title === 'string' && title.trim().length > 0) return title;

  return `${fallbackPrefix} ${index + 1}`;
};
