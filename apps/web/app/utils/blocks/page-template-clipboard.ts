import type { Block } from '@plentymarkets/shop-api';
import { v4 as uuid } from 'uuid';
import type { PageTemplateEnvelope } from './types';

export const PAGE_TEMPLATE_CLIPBOARD_KIND = 'plentyshop-page-template';
export const PAGE_TEMPLATE_CLIPBOARD_VERSION = 1;

/**
 * Recursively assigns a fresh `meta.uuid` to every block in the given tree (in place).
 */
export const regenerateBlockUuids = (blocks: Block[]): void => {
  for (const block of blocks) {
    block.meta.uuid = uuid();
    if (Array.isArray(block.content)) {
      regenerateBlockUuids(block.content as Block[]);
    }
  }
};

const isPageBodyBlock = (block: Block) => !isGlobalBlock(block) && !block.meta?.isGlobalTemplate;

/**
 * Serializes page body blocks for the system clipboard. Header and footer (global) blocks are excluded.
 */
export const serializePageTemplate = (blocks: Block[]): string => {
  const envelope: PageTemplateEnvelope = {
    kind: PAGE_TEMPLATE_CLIPBOARD_KIND,
    version: PAGE_TEMPLATE_CLIPBOARD_VERSION,
    blocks: deepClone(blocks).filter(isPageBodyBlock),
  };
  return JSON.stringify(envelope);
};

/**
 * Parses clipboard text into page body blocks. Returns `null` if the text is not a valid page template.
 */
export const parsePageTemplate = (text: string): Block[] | null => {
  try {
    const parsed = JSON.parse(text) as Partial<PageTemplateEnvelope> | null;
    if (
      parsed?.kind !== PAGE_TEMPLATE_CLIPBOARD_KIND ||
      parsed.version !== PAGE_TEMPLATE_CLIPBOARD_VERSION ||
      !Array.isArray(parsed.blocks)
    ) {
      return null;
    }
    return parsed.blocks.filter(isPageBodyBlock);
  } catch {
    return null;
  }
};
