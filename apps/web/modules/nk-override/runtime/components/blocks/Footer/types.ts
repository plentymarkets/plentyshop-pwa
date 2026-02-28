import type {FooterContent} from '~/components/blocks/Footer/types'; // 
import type { Block } from '@plentymarkets/shop-api';

export interface NkFooterContent extends FooterContent {
  footnoteDescription?: string;   // NK add footnote description
}

export type FooterProps = Partial<Omit<Block, 'content'>> & {
  content?: NkFooterContent;
};

export type FooterBlock = Block & {
  name: 'Footer';
  type: 'content';
  content: NkFooterContent;
};

export interface FooterSwitchDefinition {
  columnGroup: 'legal' | 'services';
  key: string;
  shopTranslationKey: string;
  editorTranslationKey: string;
  link: string;
}

export interface FooterColumn {
  title: string;
  description?: string;
  showContactLink?: boolean;
  showRegisterLink?: boolean;
  showTermsAndConditions?: boolean;
  showCancellationRights?: boolean;
  showCancellationForm?: boolean;
  showLegalDisclosure?: boolean;
  showPrivacyPolicy?: boolean;
  showDeclarationOfAccessibility?: boolean;
  [key: string]: string | boolean | undefined;
}