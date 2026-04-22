import type { Block } from '@plentymarkets/shop-api';
import type { FooterContent } from '~/components/blocks/Footer/types';
import { v4 as uuid } from 'uuid';

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

export function createFooter(): Block {
  return {
    name: 'Footer',
    type: 'content',
    meta: {
      uuid: uuid(),
      isGlobalTemplate: true,
    },
    content: createDefaultFooterContent(),
  };
}
