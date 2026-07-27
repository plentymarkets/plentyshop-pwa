import type { LocalizationMessage } from '@plentymarkets/shop-core';

export type IconEmojiPickerTab = 'icons' | 'emojis';

export type LocalizationKeyEntry = {
  key: string;
  translations: Record<string, LocalizationMessage>;
};
