import type { Block } from '@plentymarkets/shop-api';
import type { FooterContainerBlock } from '~/components/blocks/structure/FooterContainer/types';
import { FOOTER_SWITCH_DEFINITIONS } from '~/components/blocks/Footer/constants';
import { v4 as uuid } from 'uuid';

export const FOOTER_CONTAINER_BLOCK_NAME = 'FooterContainer' as const;

export const isFooterContainerBlock = (block: Block | null | undefined): block is FooterContainerBlock =>
  block?.name === FOOTER_CONTAINER_BLOCK_NAME;

function buildColumnHtml(columnGroup: string, groupLabel: string): string {
  const links = FOOTER_SWITCH_DEFINITIONS.filter((def) => def.columnGroup === columnGroup)
    .map((def) => `<p><a href="${def.link}">${t(def.shopTranslationKey)}</a></p>`)
    .join('');
  return `<p>${groupLabel}</p>${links}`;
}

function createFooterColumnTextCard(parentSlot: number, htmlDescription = ''): Block {
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
        paddingTop: 0,
        paddingBottom: 0,
        paddingLeft: 0,
        paddingRight: 0,
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
        paddingTop: 24,
        paddingBottom: 24,
        paddingLeft: 40,
        paddingRight: 40,
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
        gap: 'XL',
        marginTop: 0,
        marginBottom: 32,
        backgroundColor: 'transparent',
      },
    },
    content: [
      createFooterColumnTextCard(0, buildColumnHtml('legal', t('footer.legal.label'))),
      createFooterColumnTextCard(1, buildColumnHtml('services', t('footer.services.label'))),
      createFooterColumnTextCard(2),
      createFooterColumnTextCard(3),
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
