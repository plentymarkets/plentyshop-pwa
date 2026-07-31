import { Extension } from '@tiptap/core';

export const createI18nPlaceholderShortcutExtension = (openModal?: () => void) =>
  Extension.create({
    name: 'i18nPlaceholderShortcuts',

    addKeyboardShortcuts() {
      return {
        'Mod-Alt-t': () => {
          openModal?.();
          return true;
        },
      };
    },
  });
