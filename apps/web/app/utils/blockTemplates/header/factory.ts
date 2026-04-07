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
  return createHeaderContainerBlock([createUtilityBar(), createNavigation()]);
}

export function createUtilityBar(): Block {
  return {
    name: 'UtilityBar',
    type: 'content',
    meta: {
      uuid: uuid(),
      isGlobalTemplate: true,
    },
    content: {
      layout: {
        paddingTop: 20,
        paddingBottom: 20,
        paddingLeft: 40,
        paddingRight: 40,
      },
      sectionOrder: {
        sections: ['logo', 'search', 'actions'],
      },
      sectionVisibility: {
        logo: true,
        search: true,
        actions: true,
      },
      color: {
        iconColor: '#ffffff',
        backgroundColor: 'rgb(var(--colors-2-primary-500))',
      },
      search: {
        displayMode: 'full',
      },
      actions: {
        order: ['language', 'wishlist', 'cart', 'account'],
        visibility: {
          language: true,
          wishlist: true,
          cart: true,
          account: true,
        },
      },
    },
  };
}

export function createNavigation(): Block {
  return {
    name: 'Navigation',
    type: 'content',
    meta: {
      uuid: uuid(),
      isGlobalTemplate: true,
    },
    content: {
      layout: {
        paddingTop: 20,
        paddingBottom: 20,
        paddingLeft: 20,
        paddingRight: 20,
      },
      text: {
        textAlignment: 'left',
      },
      color: {
        backgroundColor: '#ffffff',
        textColor: '#161A16',
        hoverBackgroundColor: '#f5f5f5',
      },
    },
  };
}
