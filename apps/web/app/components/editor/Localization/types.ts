import type { LocalizationMessage } from '@plentymarkets/shop-core';

export type LanguageSelectCheckboxProps = {
  lang: string;
  locale: string;
};

export type ActiveLanguageSwitchProps = {
  lang: string;
  locale: string;
  selected: boolean;
};

export interface TranslationInputProps {
  rowKey: string;
  lang: string;
  translation: LocalizationMessage | undefined;
}

export interface TranslationInputEmits {
  (e: 'update', key: string, lang: string, value: string): void;
  (e: 'revert', key: string, lang: string, data: LocalizationMessage): void;
}
