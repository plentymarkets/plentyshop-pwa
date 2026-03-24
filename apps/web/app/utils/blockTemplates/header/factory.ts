import type { HeaderContainerBlock } from '~/components/blocks/structure/HeaderContainer/types';
import type { Block } from '@plentymarkets/shop-api';
import { v4 as uuid } from 'uuid';

export const HEADER_CONTAINER_BLOCK_NAME = 'HeaderContainer' as const;

export const isHeaderContainerBlock = (block: Block | null | undefined): block is HeaderContainerBlock =>
  block?.name === HEADER_CONTAINER_BLOCK_NAME;

export function createHeaderContainerBlock(
  content: Block[],
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
    configuration: {
      visible: true,
      layout: {
        sticky: false,
      },
    },
  };
}

export function createDefaultHeaderContainerBlock(): HeaderContainerBlock {
  return createHeaderContainerBlock([createHeader()]);
}

export function createHeader(): Block {
  return {
    name: 'Header',
    type: 'content',
    meta: { uuid: uuid() },
    content: { backgroundColor: '', iconColor: '' },
  };
}
