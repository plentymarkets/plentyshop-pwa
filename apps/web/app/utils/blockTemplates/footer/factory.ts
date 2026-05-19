import type { Block } from '@plentymarkets/shop-api';
import type {
  FooterContainerBlock,
  FooterColumn,
  FooterContent,
} from '~/components/blocks/structure/FooterContainer/types';
import type { ButtonConfig } from './types';
import { FOOTER_SWITCH_DEFINITIONS } from '~/components/blocks/structure/FooterContainer/constants';
import { v4 as uuid } from 'uuid';
import { SfButtonVariant } from '@storefront-ui/vue';

export const FOOTER_CONTAINER_BLOCK_NAME = 'FooterContainer' as const;
const LEGACY_FOOTER_BLOCK_NAME = 'Footer' as const;

export const isFooterContainerBlock = (block: Block | null | undefined): block is FooterContainerBlock =>
  block?.name === FOOTER_CONTAINER_BLOCK_NAME;

export const isLegacyFooterBlock = (block: Block | null | undefined): boolean =>
  !!block &&
  block.name === LEGACY_FOOTER_BLOCK_NAME &&
  !!block.content &&
  typeof block.content === 'object' &&
  !Array.isArray(block.content);

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

function createFooterColumnTextCard(parentSlot: number, htmlDescription = '', button?: ButtonConfig): Block {
  return {
    name: 'TextCard',
    type: 'content',
    meta: {
      uuid: uuid(),
      isGlobalTemplate: false,
    },
    parent_slot: parentSlot,
    content: {
      text: {
        htmlDescription,
        textAlignment: 'left',
        color: '',
      },
      button: {
        label: button?.label ?? '',
        link: button?.link ?? '',
        variant: button?.variant ?? SfButtonVariant.primary,
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
      isGlobalTemplate: false,
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
      isGlobalTemplate: false,
    },
    configuration: {
      visible: true,
      columnWidths: [3, 3, 3, 3, 3],
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
      createFooterColumnTextCard(4, '', {
        label: t('legal.withdrawButton'),
        link: paths.cancellationForm,
        variant: SfButtonVariant.primary,
      }),
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

function buildLegacyColumnHtml(column: FooterColumn | undefined): string {
  if (!column) return '';
  const parts: string[] = [];

  if (column.title) {
    parts.push(buildColumnTitleHtml(column.title));
  }

  for (const def of FOOTER_SWITCH_DEFINITIONS) {
    if (column[def.key] === true) {
      parts.push(
        `<p><a rel="noopener noreferrer nofollow" href="${def.link}"><span style="font-size: 0.875rem">${t(def.shopTranslationKey)}</span></a></p>`,
      );
    }
  }

  if (typeof column.description === 'string' && column.description.trim() !== '') {
    parts.push(column.description);
  }

  return parts.join('');
}

function createMigratedFootnoteTextCard(legacy: FooterContent): Block {
  const align = legacy.footnoteAlign === 'left' || legacy.footnoteAlign === 'center' ? legacy.footnoteAlign : 'right';

  return {
    name: 'TextCard',
    type: 'content',
    meta: {
      uuid: uuid(),
      isGlobalTemplate: false,
    },
    content: {
      text: {
        htmlDescription: legacy.footnote ?? '',
        textAlignment: align,
        color: legacy.colors?.footnoteText ?? '#8b8d8b',
      },
      button: {
        label: '',
        link: '',
        variant: SfButtonVariant.primary,
      },
      layout: {
        backgroundColor: legacy.colors?.footnoteBackground ?? '#161a16',
        paddingTop: 16,
        paddingBottom: 16,
        paddingLeft: 40,
        paddingRight: 40,
        fullWidth: true,
      },
    },
  };
}

export function migrateLegacyFooterToContainer(legacy: Block): FooterContainerBlock {
  const legacyContent = (legacy.content ?? {}) as Partial<FooterContent>;
  const columns: (FooterColumn | undefined)[] = [
    legacyContent.column1,
    legacyContent.column2,
    legacyContent.column3,
    legacyContent.column4,
  ];

  const multiGrid: Block = {
    name: 'MultiGrid',
    type: 'structure',
    meta: {
      uuid: uuid(),
      isGlobalTemplate: false,
    },
    configuration: {
      visible: true,
      columnWidths: [3, 3, 3, 3, 3],
      layout: {
        gap: 'XL',
        marginTop: 0,
        marginBottom: 32,
        backgroundColor: 'transparent',
      },
    },
    content: [
      ...columns.map((column, index) => createFooterColumnTextCard(index, buildLegacyColumnHtml(column))),

      createFooterColumnTextCard(4, '', {
        label: t('legal.withdrawButton'),
        link: paths.cancellationForm,
        variant: SfButtonVariant.primary,
      }),
    ],
  };

  return {
    name: FOOTER_CONTAINER_BLOCK_NAME,
    type: 'structure',
    meta: {
      uuid: legacy.meta?.uuid ?? uuid(),
      isGlobalTemplate: true,
    },
    content: [multiGrid, createMigratedFootnoteTextCard(legacyContent as FooterContent)],
    configuration: {
      visible: true,
      colors: {
        background: legacyContent.colors?.background ?? '#cfe4ec',
        text: legacyContent.colors?.text ?? '#1c1c1c',
      },
    },
  };
}
