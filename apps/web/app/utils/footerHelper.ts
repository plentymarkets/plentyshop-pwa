import type { FooterSettings, FooterSwitchDefinition, AddFooterBlock } from '~/components/blocks/Footer/types';
import { v4 as uuid } from 'uuid';

export const FOOTER_SWITCH_DEFINITIONS: FooterSwitchDefinition[] = [
  {
    columnGroup: 'legal',
    key: 'showTermsAndConditions',
    shopTranslationKey: 'categories.legal.subcategories.termsAndConditions',
    editorTranslationKey: 'column-1-terms-and-conditions-label',
    link: paths.termsAndConditions,
  },
  {
    columnGroup: 'legal',
    key: 'showCancellationRights',
    shopTranslationKey: 'categories.legal.subcategories.cancellationRights',
    editorTranslationKey: 'column-1-cancellation-rights-label',
    link: paths.cancellationRights,
  },
  {
    columnGroup: 'legal',
    key: 'showCancellationForm',
    shopTranslationKey: 'categories.legal.subcategories.cancellationForm',
    editorTranslationKey: 'column-1-cancellation-form-label',
    link: paths.cancellationForm,
  },
  {
    columnGroup: 'legal',
    key: 'showLegalDisclosure',
    shopTranslationKey: 'categories.legal.subcategories.legalDisclosure',
    editorTranslationKey: 'column-1-legal-disclosure-label',
    link: paths.legalDisclosure,
  },
  {
    columnGroup: 'legal',
    key: 'showPrivacyPolicy',
    shopTranslationKey: 'categories.legal.subcategories.privacyPolicy',
    editorTranslationKey: 'column-1-privacy-policy-label',
    link: paths.privacyPolicy,
  },
  {
    columnGroup: 'legal',
    key: 'showDeclarationOfAccessibility',
    shopTranslationKey: 'categories.legal.subcategories.declarationOfAccessibility',
    editorTranslationKey: 'column-1-declaration-of-accessibility-label',
    link: paths.declarationOfAccessibility,
  },
  {
    columnGroup: 'services',
    key: 'showContactLink',
    shopTranslationKey: 'categories.services.subcategories.contact',
    editorTranslationKey: 'column-2-contact-label',
    link: paths.contact,
  },
  {
    columnGroup: 'services',
    key: 'showRegisterLink',
    shopTranslationKey: 'categories.services.subcategories.register',
    editorTranslationKey: 'column-2-register-label',
    link: paths.register,
  },
];

export const createDefaultFooterSettings = (): FooterSettings => {
  const { $i18n } = useNuxtApp();

  return {
    meta: {
      uuid: uuid(),
      isGlobalTemplate: true,
    },
    column1: {
      title: $i18n.t('categories.legal.label'),
      showTermsAndConditions: true,
      showCancellationRights: true,
      showCancellationForm: true,
      showLegalDisclosure: true,
      showPrivacyPolicy: true,
      showDeclarationOfAccessibility: true,
    },
    column2: {
      title: $i18n.t('categories.services.label'),
      description: '',
      showContactLink: true,
      showRegisterLink: true,
    },
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

export const mapFooterData = (data: FooterSettings | null): FooterSettings => {
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
