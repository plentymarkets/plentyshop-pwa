import type { FooterSettings, FooterSwitchDefinition, AddFooterBlock } from '~/components/blocks/Footer/types';
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

const createDefaultFooterSettings = (): FooterSettings => {
  const runtimeConfig = useRuntimeConfig();

  return {
    meta: {
      uuid: uuid(),
      isGlobalTemplate: true,
    },
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

const extractFooterFromBlocks = (content: string): FooterSettings | null => {
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
    const footerBlock = {
      name: 'Footer',
      type: 'content',
      meta: {
        uuid: uuid(),
        isGlobalTemplate: true,
      },
      content: cachedFooter.value || {
        ...createDefaultFooterSettings(),
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

const mapFooterData = (data: FooterSettings | null): FooterSettings => {
  const defaults = createDefaultFooterSettings();

  return {
    ...defaults,
    ...data,
    meta: {
      ...defaults.meta,
      ...data?.meta,
    },
    column1: {
      ...defaults.column1,
      ...data?.column1,
    },
    column2: {
      ...defaults.column2,
      ...data?.column2,
    },
    column3: {
      ...defaults.column3,
      ...data?.column3,
    },
    column4: {
      ...defaults.column4,
      ...data?.column4,
    },
    colors: {
      ...defaults.colors,
      ...data?.colors,
    },
  };
};

export const useFooter = () => {
  const footerCache = useState<FooterSettings | null>('footer-settings-cache', () => null);

  const clearFooterCache = () => {
    footerCache.value = null;
  };

  const updateFooterCache = (newFooterSettings: FooterSettings) => {
    footerCache.value = newFooterSettings;
  };

  const getFooterSettings = (): FooterSettings => {
    return footerCache.value || createDefaultFooterSettings();
  };

  const fetchFooterSettings = async (): Promise<FooterSettings> => {
    if (footerCache.value) {
      return footerCache.value;
    }

    const nuxtApp = useNuxtApp();

    return callWithNuxt(nuxtApp, async () => {
      try {
        const { data } = await useAsyncData(`footer-settings-${nuxtApp.$i18n.locale}`, () =>
          useSdk().plentysystems.getBlocks({
            identifier: 'index',
            type: 'immutable',
            blocks: 'Footer',
          }),
        );

        const footerBlock = data.value?.data?.find((block) => block.name === 'Footer');

        if (footerBlock?.content) {
          footerCache.value = footerBlock.content as FooterSettings;
          return footerCache.value;
        }
      } catch (error) {
        console.warn('Failed to fetch footer settings, using defaults:', error);
      }

      footerCache.value = getFooterSettings();
      return footerCache.value;
    });
  };

  return {
    footerCache: readonly(footerCache),
    fetchFooterSettings,
    getFooterSettings,
    createDefaultFooterSettings,
    clearFooterCache,
    updateFooterCache,
    extractFooterFromBlocks,
    addFooterBlock,
    mapFooterData,
    FOOTER_SWITCH_DEFINITIONS,
  };
};
