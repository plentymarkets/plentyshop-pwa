import type { Block } from '@plentymarkets/shop-api';
import type { FooterBlock, FooterContent, FooterSwitchDefinition } from '~/components/blocks/Footer/types';
import { v4 as uuid } from 'uuid';

export const FOOTER_BLOCK_NAME = 'Footer' as const;

export const isFooterBlock = (block: Block | null | undefined): block is FooterBlock =>
  block?.name === FOOTER_BLOCK_NAME;

export function createFooterBlock(
  content: FooterContent,
  meta?: { uuid?: string; isGlobalTemplate?: boolean },
): FooterBlock {
  return {
    name: FOOTER_BLOCK_NAME,
    type: 'content',
    meta: {
      uuid: meta?.uuid || uuid(),
      isGlobalTemplate: meta?.isGlobalTemplate ?? true,
    },
    content,
  };
}

export function createDefaultFooterContent(): FooterContent {
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
}

export function createDefaultFooterBlock(): FooterBlock {
  return createFooterBlock(createDefaultFooterContent());
}

export function mapFooterData(data: Block | null): FooterBlock {
  if (!data) return createDefaultFooterBlock();

  const defaultContent = createDefaultFooterContent();
  const dataContent = data.content as FooterContent | undefined;

  return createFooterBlock(
    {
      ...defaultContent,
      ...dataContent,
      column1: { ...defaultContent.column1, ...dataContent?.column1 },
      column2: { ...defaultContent.column2, ...dataContent?.column2 },
      column3: { ...defaultContent.column3, ...dataContent?.column3 },
      column4: { ...defaultContent.column4, ...dataContent?.column4 },
      colors: { ...defaultContent.colors, ...dataContent?.colors },
    },
    {
      uuid: data.meta?.uuid,
      isGlobalTemplate: data.meta?.isGlobalTemplate,
    },
  );
}

export function extractFooterContentFromBlocks(content: string): FooterContent | null {
  try {
    const blocks = JSON.parse(content);
    const footerBlock = Array.isArray(blocks) ? blocks.find((block: Block) => isFooterBlock(block)) : null;
    return footerBlock?.content || null;
  } catch (error) {
    console.warn('Failed to extract footer from blocks:', error);
    return null;
  }
}

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

/** Template factory — creates a minimal footer block for new page templates */
export function createFooter(): Block {
  const column1Title = t('defaultTemplate.footer.column1.title');
  const column2Title = t('defaultTemplate.footer.column2.title');

  return {
    name: FOOTER_BLOCK_NAME,
    type: 'content',
    meta: {
      uuid: uuid(),
      isGlobalTemplate: true,
    },
    content: {
      column1: { title: column1Title },
      column2: { title: column2Title, showContactLink: true },
      column3: { title: '' },
      column4: { title: '' },
      footnote: '',
      footnoteAlign: 'right',
      colors: {
        background: '#cfe4ec',
        text: '#151a16',
        footnoteBackground: '#151a16',
        footnoteText: '#8b8d8b',
      },
    },
  };
}
