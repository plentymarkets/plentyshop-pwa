import type { Block } from '@plentymarkets/shop-api';
import type { FooterContainerBlock } from '~/components/blocks/structure/FooterContainer/types';
import { FOOTER_SWITCH_DEFINITIONS } from '~/components/blocks/Footer/constants';
import { v4 as uuid } from 'uuid';

export const FOOTER_CONTAINER_BLOCK_NAME = 'FooterContainer' as const;

export const isFooterContainerBlock = (block: Block | null | undefined): block is FooterContainerBlock =>
  block?.name === FOOTER_CONTAINER_BLOCK_NAME;

function buildColumnTitleHtml(title: string): string {
  return `<h5><span style="font-size: 1rem;">${title}</span></h5>`;
}

function buildColumnHtml(columnGroup: string, groupLabel: string): string {
  const links = FOOTER_SWITCH_DEFINITIONS.filter((def) => def.columnGroup === columnGroup)
    .map(
      (def) =>
        `<p><a rel="noopener noreferrer nofollow" href="${def.link}"><span style="font-size: 0.875rem">${t(def.shopTranslationKey)}</span></a></p>`,
    )
    .join('');
  return `${buildColumnTitleHtml(groupLabel)}${links}`;
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
        htmlDescription: `<p><span style="font-size: 0.875rem;">© ${runtimeConfig.public.storename} ${new Date().getFullYear()}</span></p>`,
        textAlignment: 'right',
        color: '#8b8d8b',
      },
      button: {
        label: '',
        link: '',
        variant: 'primary',
      },
      layout: {
        backgroundColor: '#161a16',
        paddingTop: 16,
        paddingBottom: 16,
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
