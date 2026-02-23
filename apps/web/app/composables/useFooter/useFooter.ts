import type { FooterSettings, FooterSwitchDefinition, AddFooterBlock } from '~/components/blocks/Footer/types';
import type { Block } from '@plentymarkets/shop-api';
import { v4 as uuid } from 'uuid';
import { callWithNuxt } from '#app';

const FOOTER_SWITCH_DEFINITIONS: FooterSwitchDefinition[] = [
  {
    columnGroup: 'legal',
    key: 'showTermsAndConditions',
    shopTranslationKey: 'legal.termsAndConditions',
    editorTranslationKey: 'column-1-terms-and-conditions-label',
    link: paths.termsAndConditions,
  },
  {
    columnGroup: 'legal',
    key: 'showCancellationRights',
    shopTranslationKey: 'legal.cancellationRights',
    editorTranslationKey: 'column-1-cancellation-rights-label',
    link: paths.cancellationRights,
  },
  {
    columnGroup: 'legal',
    key: 'showCancellationForm',
    shopTranslationKey: 'legal.cancellationForm',
    editorTranslationKey: 'column-1-cancellation-form-label',
    link: paths.cancellationForm,
  },
  {
    columnGroup: 'legal',
    key: 'showLegalDisclosure',
    shopTranslationKey: 'legal.legalDisclosure',
    editorTranslationKey: 'column-1-legal-disclosure-label',
    link: paths.legalDisclosure,
  },
  {
    columnGroup: 'legal',
    key: 'showPrivacyPolicy',
    shopTranslationKey: 'legal.privacyPolicy',
    editorTranslationKey: 'column-1-privacy-policy-label',
    link: paths.privacyPolicy,
  },
  {
    columnGroup: 'legal',
    key: 'showDeclarationOfAccessibility',
    shopTranslationKey: 'legal.declarationOfAccessibility',
    editorTranslationKey: 'column-1-declaration-of-accessibility-label',
    link: paths.declarationOfAccessibility,
  },
  {
    columnGroup: 'services',
    key: 'showContactLink',
    shopTranslationKey: 'footer.contact.label',
    editorTranslationKey: 'column-2-contact-label',
    link: paths.contact,
  },
  {
    columnGroup: 'services',
    key: 'showRegisterLink',
    shopTranslationKey: 'footer.register.label',
    editorTranslationKey: 'column-2-register-label',
    link: paths.register,
  },
];

const createDefaultFooterContent = (): FooterSettings => {
  const runtimeConfig = useRuntimeConfig();

  return {
    column1: {
      title: t('footer.legal.label'),
      showTermsAndConditions: true,
      showCancellationRights: true,
      showCancellationForm: true,
      showLegalDisclosure: true,
      showPrivacyPolicy: true,
      showDeclarationOfAccessibility: true,
    },
    column2: {
      title: t('footer.services.label'),
      description: '',
      showContactLink: true,
      showRegisterLink: true,
    },
    column3: { title: '', description: '' },
    column4: { title: '', description: '' },
    footnote: `© ${runtimeConfig.public.storename} ${new Date().getFullYear()}`,
    footnoteAlign: 'right',
    colors: {
      background: '#cfe4ec',
      text: '#1c1c1c',
      footnoteBackground: '#161a16',
      footnoteText: '#959795',
    },
  };
};

/**
 * Helper to create a footer Block from content and optional meta
 */
const createFooterBlock = (content: FooterSettings, meta?: { uuid?: string; isGlobalTemplate?: boolean }): Block => {
  return {
    name: 'Footer',
    type: 'content',
    meta: {
      uuid: meta?.uuid || uuid(),
      isGlobalTemplate: meta?.isGlobalTemplate ?? true,
    },
    content,
  };
};

const createDefaultFooterBlock = (): Block => {
  return createFooterBlock(createDefaultFooterContent());
};

const extractFooterContentFromBlocks = (content: string): FooterSettings | null => {
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

const addFooterBlock: AddFooterBlock = ({ data, cachedFooter, cleanData }) => {
  const footerExists = data.value.some((block) => block.name === 'Footer');

  if (!footerExists) {
    const footerBlock = cachedFooter.value || createDefaultFooterBlock();

    data.value.push(footerBlock);

    if (cleanData) {
      cleanData.value.push(JSON.parse(JSON.stringify(footerBlock)));
    }
  }
};

const mapFooterData = (data: Block | null): Block => {
  if (!data) {
    return createDefaultFooterBlock();
  }

  const defaultContent = createDefaultFooterContent();
  const dataContent = data.content as FooterSettings | undefined;

  return createFooterBlock(
    {
      ...defaultContent,
      ...dataContent,
      column1: {
        ...defaultContent.column1,
        ...dataContent?.column1,
      },
      column2: {
        ...defaultContent.column2,
        ...dataContent?.column2,
      },
      column3: {
        ...defaultContent.column3,
        ...dataContent?.column3,
      },
      column4: {
        ...defaultContent.column4,
        ...dataContent?.column4,
      },
      colors: {
        ...defaultContent.colors,
        ...dataContent?.colors,
      },
    },
    {
      uuid: data.meta?.uuid,
      isGlobalTemplate: data.meta?.isGlobalTemplate,
    },
  );
};

/**
 * Composable for accessing global footer block
 * Handles fetching and caching of footer configuration
 */
export const useFooter = () => {
  const nuxtApp = useNuxtApp();
  const footerCache = useState<Block | null>(`footer-block-cache-${nuxtApp.$i18n.locale.value}`, () => null);

  const clearFooterCache = () => {
    footerCache.value = null;
  };

  const updateFooterCache = (newFooterBlock: Block) => {
    footerCache.value = newFooterBlock;
  };

  const getFooterBlock = (): Block => {
    return footerCache.value || createDefaultFooterBlock();
  };

  const fetchFooterBlock = async (): Promise<Block> => {
    if (footerCache.value) {
      return footerCache.value;
    }

    return callWithNuxt(nuxtApp, async () => {
      try {
        const { data } = await useAsyncData(`footer-block-${nuxtApp.$i18n.locale.value}`, () =>
          useSdk().plentysystems.getBlocks({
            identifier: 'index',
            type: 'immutable',
            blocks: 'Footer',
          }),
        );

        const footerBlock = data.value?.data?.find((block) => block.name === 'Footer');

        if (footerBlock) {
          footerCache.value = footerBlock as Block;
          return footerCache.value;
        }
      } catch (error) {
        console.warn('Failed to fetch footer block, using defaults:', error);
      }

      footerCache.value = getFooterBlock();
      return footerCache.value;
    });
  };

  return {
    footerCache: readonly(footerCache),
    fetchFooterBlock,
    getFooterBlock,
    createDefaultFooterBlock,
    createFooterBlock,
    clearFooterCache,
    updateFooterCache,
    extractFooterContentFromBlocks,
    addFooterBlock,
    mapFooterData,
    FOOTER_SWITCH_DEFINITIONS,
  };
};
