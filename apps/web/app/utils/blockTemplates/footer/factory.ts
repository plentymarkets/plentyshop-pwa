import type { Block } from '@plentymarkets/shop-api';
import type { FooterContainerBlock } from '~/components/blocks/structure/FooterContainer/types';
import { v4 as uuid } from 'uuid';

export const FOOTER_CONTAINER_BLOCK_NAME = 'FooterContainer' as const;

export const isFooterContainerBlock = (block: Block | null | undefined): block is FooterContainerBlock =>
  block?.name === FOOTER_CONTAINER_BLOCK_NAME;

function createFooterColumnTextCard(parentSlot: number, title: string, htmlDescription = ''): Block {
  return {
    name: 'TextCard',
    type: 'content',
    meta: {
      uuid: uuid(),
      isGlobalTemplate: true,
    },
    parent_slot: parentSlot,
    content: {
      text: {
        title,
        htmlDescription,
        textAlignment: 'left',
        color: '',
      },
      button: {
        label: '',
        link: '',
        variant: 'primary',
      },
      layout: {
        backgroundColor: '',
        paddingTop: '16px',
        paddingBottom: '16px',
        paddingLeft: '16px',
        paddingRight: '16px',
      },
    },
  };
}

function createFooterNoteTextCard(): Block {
  const runtimeConfig = useRuntimeConfig();

  return {
    name: 'TextCard',
    type: 'content',
    meta: {
      uuid: uuid(),
      isGlobalTemplate: true,
    },
    content: {
      text: {
        htmlDescription: `© ${runtimeConfig.public.storename} ${new Date().getFullYear()}`,
        textAlignment: 'right',
        color: '#959795',
      },
      button: {
        label: '',
        link: '',
        variant: 'primary',
      },
      layout: {
        backgroundColor: '#161a16',
        paddingTop: '24px',
        paddingBottom: '24px',
        paddingLeft: '40px',
        paddingRight: '40px',
        fullWidth: true,
      },
    },
  };
}

function createFooterMultiGrid(): Block {
  return {
    name: 'MultiGrid',
    type: 'structure',
    meta: {
      uuid: uuid(),
      isGlobalTemplate: true,
    },
    configuration: {
      visible: true,
      columnWidths: [3, 3, 3, 3],
      layout: {
        gap: 'M',
        marginTop: 0,
        marginBottom: 0,
        backgroundColor: 'transparent',
      },
    },
    content: [
      createFooterColumnTextCard(0, t('footer.legal.label')),
      createFooterColumnTextCard(1, t('footer.services.label')),
      createFooterColumnTextCard(2, ''),
      createFooterColumnTextCard(3, ''),
    ],
  };
}

export function createFooterContainer(): FooterContainerBlock {
  return {
    name: FOOTER_CONTAINER_BLOCK_NAME,
    type: 'structure',
    meta: {
      uuid: uuid(),
      isGlobalTemplate: true,
    },
    content: [createFooterMultiGrid(), createFooterNoteTextCard()],
    configuration: {
      visible: true,
      colors: {
        background: '#cfe4ec',
        text: '#1c1c1c',
      },
    },
  };
}
