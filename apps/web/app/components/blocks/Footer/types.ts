import type { Block } from '@plentymarkets/shop-api';

export type FooterProps = Partial<Omit<Block, 'content'>> & {
  content?: FooterContent;
};

export type FooterBlock = Block & {
  name: 'Footer';
  type: 'content';
  content: FooterContent;
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

export interface FooterColors {
  background: string;
  text: string;
  footnoteBackground: string;
  footnoteText: string;
}

export interface FooterContent {
  column1: FooterColumn;
  column2: FooterColumn;
  column3: FooterColumn;
  column4: FooterColumn;
  footnote: string;
  footnoteAlign: 'left' | 'center' | 'right';
  colors: FooterColors;
}
