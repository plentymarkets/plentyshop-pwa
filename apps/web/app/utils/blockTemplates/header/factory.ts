import type { HeaderContainerBlock, HeaderContainerContent } from '~/components/blocks/structure/HeaderContainer/types';
import type { Block } from '@plentymarkets/shop-api';
import { v4 as uuid } from 'uuid';

export const HEADER_CONTAINER_BLOCK_NAME = 'HeaderContainer' as const;

export function createHeaderContainer(): HeaderContainerBlock {
  return {
    name: HEADER_CONTAINER_BLOCK_NAME,
    type: 'structure',
    meta: {
      uuid: uuid(),
      isGlobalTemplate: true,
    },
    content: {
      sections: [
        {
          identifier: 'header',
          type: 'header',
          enabled: true,
          order: 0,
        },
      ],
    },
  };
}

export const isHeaderContainerBlock = (block: Block | null | undefined): block is HeaderContainerBlock =>
  block?.name === HEADER_CONTAINER_BLOCK_NAME;

export function createHeaderContainerBlock(
  content: HeaderContainerContent,
  meta?: { uuid?: string; isGlobalTemplate?: boolean },
): HeaderContainerBlock {
  return {
    name: HEADER_CONTAINER_BLOCK_NAME,
    type: 'structure',
    meta: {
      uuid: meta?.uuid || uuid(),
      isGlobalTemplate: meta?.isGlobalTemplate ?? true,
    },
    content,
  };
}

export function createDefaultHeaderContainerBlock(): HeaderContainerBlock {
  return createHeaderContainerBlock(createHeaderContainer().content);
}
