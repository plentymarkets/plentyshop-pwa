import { v4 as uuid } from 'uuid';
import type { TextCardProps } from './types';
import type { Block } from '@plentymarkets/shop-api';
import type { BlocksList } from '~/composables/useBlocksList/types';

const TEXT_CARD_ICON = 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/Blocks/text-card.svg';

const createTestTextCard = (pretitle: string, title: string, subtitle: string): TextCardProps => ({
  name: 'TextCard',
  type: 'TextCard',
  meta: { uuid: uuid() },
  configuration: {
    visible: true,
  },
  content: {
    text: {
      pretitle,
      title,
      subtitle,
      textAlignment: 'left',
      color: '#000000',
    },
    button: {
      label: 'Learn More',
      link: '#',
      variant: 'primary',
    },
    layout: {
      backgroundColor: '#f3f4f6',
      paddingTop: '24px',
      paddingBottom: '24px',
      paddingLeft: '16px',
      paddingRight: '16px',
    },
  },
});

const createTestTextCardBlock = (pretitle: string, title: string, subtitle: string): Block => ({
  name: 'TextCard',
  type: 'TextCard',
  meta: { uuid: uuid() },
  configuration: {
    visible: true,
  },
  content: {
    text: {
      pretitle,
      title,
      subtitle,
      textAlignment: 'left',
      color: '#000000',
    },
    button: {
      label: 'Learn More',
      link: '#',
      variant: 'primary',
    },
    layout: {
      backgroundColor: '#f3f4f6',
      paddingTop: '24px',
      paddingBottom: '24px',
      paddingLeft: '16px',
      paddingRight: '16px',
    },
  },
});

export const getBlocksList = (): BlocksList => ({
  content: {
    category: 'content',
    title: 'Text Card (Test Override)',
    blockName: 'TextCard',
    accessControl: ['content'],
    variations: [
      {
        title: '[TEST] Text Card (Module Override)',
        image: TEXT_CARD_ICON,
        template: {
          en: createTestTextCardBlock(
            '[TEST] Pretitle',
            'Test TextCard Override',
            'This is a module override demonstrating multi-source block discovery',
          ),
          de: createTestTextCardBlock(
            '[TEST] Untertitel',
            'Test TextCard Überschreibung',
            'Dies ist eine Modulüberschreibung, die die Erkennung von Multi-Source-Blöcken demonstriert',
          ),
        },
      },
    ],
  },
});

export const createDefault = (): TextCardProps => {
  return createTestTextCard('[TEST] Pretitle', 'Test TextCard', 'A test override from the test-blocks module');
};

export const labelPath = 'content.text.title';
