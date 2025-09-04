import type { FooterSettings, AddFooterBlock } from '~/components/blocks/Footer/types';
import { v4 as uuid } from 'uuid';

const createDefaultFooterSettings = (t: (key: string) => string): FooterSettings => {
  return {
    meta: {
      uuid: uuid(),
      isGlobalTemplate: true,
    },
    column1: { title: t('categories.legal.label') },
    column2: { title: t('categories.contact.label'), description: '', showContactLink: true },
    column3: { title: '', description: '' },
    column4: { title: '', description: '' },
    footnote: `© PlentyONE GmbH ${new Date().getFullYear()}`,
    footnoteAlign: 'right',
    colors: {
      background: '#cfe4ec',
      text: '#1c1c1c',
      footnoteBackground: '#161a16',
      footnoteText: '#959795',
    },
  };
};

export const getDefaultFooterSettings = (): FooterSettings => {
  const { $i18n } = useNuxtApp();
  return createDefaultFooterSettings($i18n.t);
};

export const extractFooterFromBlocks = (content: string): FooterSettings | null => {
  try {
    const blocks = JSON.parse(content);
    const footerBlock = Array.isArray(blocks)
      ? blocks.find((block: { name?: string }) => block.name === 'Footer')
      : null;

    return footerBlock?.content || null;
  } catch (error) {
    console.warn('Failed to extract footer from blocks:', error);
    return null;
  }
};

export const addFooterBlock: AddFooterBlock = ({ data, cachedFooter, cleanData }) => {
  const footerExists = data.value.some((block) => block.name === 'Footer');

  if (!footerExists) {
    const defaultSettings = getDefaultFooterSettings();

    const footerBlock = {
      name: 'Footer',
      type: 'content',
      meta: {
        uuid: uuid(),
        isGlobalTemplate: true,
      },
      content: cachedFooter.value || {
        ...defaultSettings,
        meta: {
          uuid: uuid(),
          isGlobalTemplate: true,
        },
      },
    };
    data.value.push(footerBlock);

    if (cleanData) {
      cleanData.value.push(JSON.parse(JSON.stringify(footerBlock)));
    }
  }
};
