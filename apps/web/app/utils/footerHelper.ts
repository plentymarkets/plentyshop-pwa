import type { FooterSwitchDefinition, FooterBlock } from '~/components/blocks/Footer/types';
import { v4 as uuid } from 'uuid';

export const FOOTER_SWITCH_DEFINITIONS: FooterSwitchDefinition[] = [
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

export const createDefaultFooterBlock = (): FooterBlock => {
  const runtimeConfig = useRuntimeConfig();

  return {
    name: 'Footer',
    type: 'content',
    meta: {
      uuid: uuid(),
      isGlobalTemplate: true,
    },
    content: {
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
    },
  };
};

export const extractFooterFromBlocks = (content: string): FooterBlock | null => {
  try {
    const blocks = JSON.parse(content);
    const footerBlock = Array.isArray(blocks)
      ? blocks.find((block: { name?: string }) => block.name === 'Footer')
      : null;

    return footerBlock || null;
  } catch (error) {
    console.warn('Failed to extract footer from blocks:', error);
    return null;
  }
};

export const mapFooterData = (data: FooterBlock | null): FooterBlock => {
  const defaults = createDefaultFooterBlock();

  return {
    ...defaults,
    ...data,
    name: 'Footer',
    type: 'content',
    meta: {
      ...defaults.meta,
      ...data?.meta,
    },
    content: {
      ...defaults.content,
      ...data?.content,
    },
  };
};
