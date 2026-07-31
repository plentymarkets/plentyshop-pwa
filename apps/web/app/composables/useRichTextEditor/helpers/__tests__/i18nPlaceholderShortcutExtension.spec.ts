import type { Editor } from '@tiptap/core';
import { createI18nPlaceholderShortcutExtension } from '../i18nPlaceholderShortcutExtension';

const getShortcuts = (openModal?: () => void) => {
  const extension = createI18nPlaceholderShortcutExtension(openModal);
  return (
    extension.config.addKeyboardShortcuts?.call({
      name: 'i18nPlaceholderShortcuts',
      options: extension.options,
      storage: extension.storage,
      editor: {} as Editor,
      type: null,
      parent: undefined,
    }) ?? {}
  );
};

const shortcutProps = { editor: {} as Editor };

describe('i18nPlaceholderShortcutExtension', () => {
  it('should open the i18n key modal with Mod-Alt-t', () => {
    const openModal = vi.fn();
    const shortcuts = getShortcuts(openModal);

    expect(shortcuts['Mod-Alt-t']?.(shortcutProps)).toBe(true);
    expect(openModal).toHaveBeenCalledTimes(1);
  });

  it('should handle the shortcut even when no opener is configured', () => {
    const shortcuts = getShortcuts();

    expect(shortcuts['Mod-Alt-t']?.(shortcutProps)).toBe(true);
  });
});
