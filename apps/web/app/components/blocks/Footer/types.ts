import type { Block } from '@plentymarkets/shop-api';

export type FooterProps = {
  content?: FooterSettings;
};

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

export interface FooterSettings {
  meta: {
    uuid: string;
    isGlobalTemplate?: boolean;
  };
  column1: FooterSettingsColumn;
  column2: FooterSettingsColumn;
  column3: FooterSettingsColumn;
  column4: FooterSettingsColumn;
  footnote: string;
  footnoteAlign: 'left' | 'center' | 'right';
  colors: FooterSettingsColors;
}

type AddFooterBlockOptions = {
  data: Ref<Block[]>;
  cachedFooter: Ref<unknown>;
  cleanData?: Ref<Block[]>;
};

export type AddFooterBlock = (options: AddFooterBlockOptions) => void;
