import type { Block } from '@plentymarkets/shop-api';

export type FooterProps = FooterBlock;
export interface FooterSwitchDefinition {
  columnGroup: 'legal' | 'services';
  key: string;
  shopTranslationKey: string;
  editorTranslationKey: string;
  link: string;
}

export interface FooterSettingsColumn {
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

export interface FooterSettingsColors {
  background: string;
  text: string;
  footnoteBackground: string;
  footnoteText: string;
}

export interface FooterBlock extends Block {
  name: string;
  type: string;
  meta: {
    uuid: string;
    isGlobalTemplate?: boolean;
  };
  content: {
    column1: FooterSettingsColumn;
    column2: FooterSettingsColumn;
    column3: FooterSettingsColumn;
    column4: FooterSettingsColumn;
    footnote: string;
    footnoteAlign: 'left' | 'center' | 'right';
    colors: FooterSettingsColors;
  };
}
