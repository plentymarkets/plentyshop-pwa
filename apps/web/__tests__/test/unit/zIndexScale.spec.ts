import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import tailwindConfig from '../../../app/configuration/tailwind.config';

/**
 * Approval test for the z-index token scale.
 *
 * This test ensures that the z-index hierarchy defined in tailwind.config.ts
 * is not unintentionally changed. If you need to modify the z-index scale:
 *   1. Make your changes in tailwind.config.ts
 *   2. Run `npx vitest -u` to update the snapshot
 *   3. Commit the updated snapshot alongside your code change
 */
describe('Z-Index Token Scale', () => {
  const zIndexTokens = (tailwindConfig.theme?.extend as Record<string, unknown>)?.zIndex as Record<string, string>;

  it('should match the approved z-index scale (snapshot)', () => {
    expect(zIndexTokens).toMatchSnapshot();
  });

  it('should have all values in strictly ascending order', () => {
    const entries = Object.entries(zIndexTokens);
    const values = entries.map(([name, val]) => ({ name, value: Number(val) }));

    for (let i = 1; i < values.length; i++) {
      const prev = values[i - 1]!;
      const curr = values[i]!;
      expect(
        curr.value,
        `"${curr.name}" (${curr.value}) must be greater than "${prev.name}" (${prev.value})`,
      ).toBeGreaterThan(prev.value);
    }
  });

  it('should not have duplicate z-index values', () => {
    const values = Object.values(zIndexTokens).map(Number);
    const unique = new Set(values);
    expect(unique.size).toBe(values.length);
  });

  it('should contain required layers', () => {
    const requiredLayers = [
      'base',
      'sticky',
      'dropdown',
      'drawer-backdrop',
      'drawer',
      'modal-backdrop',
      'modal',
      'max',
    ];

    for (const layer of requiredLayers) {
      expect(zIndexTokens, `Missing required layer: "${layer}"`).toHaveProperty(layer);
    }
  });

  it('should maintain correct relative ordering of critical layers', () => {
    const val = (name: string) => Number(zIndexTokens[name]);

    // Content < Navigation < Overlays < Modals < Critical
    expect(val('base')).toBeLessThan(val('sticky'));
    expect(val('sticky')).toBeLessThan(val('dropdown'));
    expect(val('dropdown')).toBeLessThan(val('drawer-backdrop'));
    expect(val('drawer-backdrop')).toBeLessThan(val('drawer'));
    expect(val('drawer')).toBeLessThan(val('modal-backdrop'));
    expect(val('modal-backdrop')).toBeLessThan(val('modal'));
    expect(val('modal')).toBeLessThan(val('max'));

    // Editor layers: drawer < inline < toolbar
    expect(val('editor-drawer')).toBeLessThan(val('editor-inline'));
    expect(val('editor-inline')).toBeLessThan(val('editor-toolbar'));

    // Editor toolbar must be above all shop UI except modals
    expect(val('editor-toolbar')).toBeGreaterThan(val('cookiebar'));
    expect(val('editor-toolbar')).toBeLessThan(val('modal-backdrop'));
  });
});

/**
 * Component z-index usage approval test.
 *
 * Ensures critical components use the correct z-index tokens.
 * If a component's z-index needs to change intentionally:
 *   1. Update the component
 *   2. Update the `approvedUsages` map below
 *   3. Commit both changes together
 */
describe('Z-Index Component Usage for the Editor components', () => {
  const appRoot = resolve(__dirname, '../../../app');

  /**
   * Approved mapping: component file path (relative to app/) → expected z-index token(s).
   * Each entry asserts that the file contains at least one occurrence of each listed token.
   */
  const approvedUsages: Record<string, string[]> = {
    // Editor chrome — highest layers
    'components/ui/Toolbar/Toolbar.vue': ['z-max'],
    'components/SettingsToolbar/SettingsToolbar.vue': ['z-editor-toolbar'],
    'components/SiteConfigurationDrawer/SiteConfigurationDrawer.vue': ['z-overlap'],
    'components/SiteConfigurationDrawer/BlocksConfigurationDrawer.vue': ['z-editor-drawer'],
    'components/editor/Localization/EditorLocalizationDrawer.vue': ['z-editor-toolbar', 'z-dropdown'],

    // Block editor controls
    'components/ui/BlockActions/BlockActions.vue': ['z-editor-inline'],
    'components/editor/AddBlockButton/AddBlockButton.vue': ['z-editor-inline'],

    // Editor modals & popovers
    'components/AddBlockPopover/AddBlockPopover.vue': ['z-modal-backdrop', 'z-modal'],
    'components/editor/HtmlEditor/HtmlEditor.vue': ['z-modal-backdrop'],
    'components/editor/RichTextEditor/RichtextEditorModal.vue': ['z-modal-backdrop'],
    'components/editor/RichTextEditor/RichTextEditorBasicButtons.vue': ['z-toast', 'z-popover'],
    'components/editor/RichTextEditor/RichTextEditorLinkModal.vue': ['z-toast'],
    'components/ui/PageModal/PageModal.vue': ['z-modal'],

    // Editor pickers (above modals)
    'components/editor/ColorPicker/ColorPicker.vue': ['z-picker'],
    'components/editor/RichTextEditor/IconEmojiPicker.vue': ['z-picker'],

    // Editor inline panels
    'components/editor/GridElementsPanel/GridElementsItem.vue': ['z-editor-inline', 'z-dropdown'],
    'components/editor/GridElementsPanel/GridElementsItemMenu.vue': ['z-dropdown'],
    'components/editor/BlockItemsAccordion/BlockItemsAccordion.vue': ['z-dropdown'],
    'components/editor/Localization/TranslationInput.vue': ['z-dropdown'],
    'components/editor/PageSelect/PageSelect.vue': ['z-popover'],

    // Editor misc
    'components/SafeModeBanner/SafeModeBanner.vue': ['z-dropdown'],
    'components/PreviewMode/PreviewMode.vue': ['z-dropdown'],

    // Shop navigation
    'components/blocks/NavbarBottom/NavbarBottom.vue': ['z-sticky'],
    'components/MegaMenu/MegaMenu.vue': ['z-sticky'],
    'components/blocks/Navigation/Navigation.vue': ['z-sticky', 'z-drawer-backdrop', 'z-drawer'],

    // Overlays
    'components/Cookiebar/Cookiebar.vue': ['z-cookiebar'],
    'components/ui/Notifications/Notifications.vue': ['z-notifications'],
  };

  /**
   * Forbidden mapping: component file path → tokens that must NOT appear.
   * Catches known past mistakes (e.g., block outline using modal-level z-index).
   */
  const forbiddenUsages: Record<string, string[]> = {
    // SettingsToolbar must be editor-toolbar, not lower
    'components/SettingsToolbar/SettingsToolbar.vue': ['z-editor-inline', 'z-editor-drawer'],
    // PageBlock outline must not use modal-level z-index (was causing bleed-through)
    'components/PageBlock/PageBlock.vue': ['z-modal-backdrop', 'z-modal'],
    // MultiGrid columns don't need z-index (isolation on #app-container handles it)
    'components/blocks/structure/MultiGrid/MultiGrid.vue': ['z-raised', 'z-editor-inline'],
    // BlockActions must not escalate to dropdown or higher (trapped by isolation)
    'components/ui/BlockActions/BlockActions.vue': ['z-dropdown', 'z-sticky', 'z-modal'],
    // AddBlockButton must not escalate beyond editor-inline (except !z-modal for popover target state)
    'components/editor/AddBlockButton/AddBlockButton.vue': ['z-dropdown', 'z-sticky'],
    // Toolbar children should not set their own z-index (they inherit from parent z-max)
    'components/ui/LanguageEditor/LanguageEditor.vue': ['z-max', 'z-modal', 'z-popover'],
    'components/ui/PageSelector/PageSelector.vue': ['z-max', 'z-modal', 'z-popover'],
  };

  const readComponent = (relativePath: string): string => {
    return readFileSync(resolve(appRoot, relativePath), 'utf-8');
  };

  describe('approved tokens are present', () => {
    for (const [file, expectedTokens] of Object.entries(approvedUsages)) {
      it(`${file} should use ${expectedTokens.join(', ')}`, () => {
        const content = readComponent(file);
        for (const token of expectedTokens) {
          expect(content, `Expected "${token}" in ${file}`).toContain(token);
        }
      });
    }
  });

  describe('forbidden tokens are absent', () => {
    for (const [file, forbiddenTokens] of Object.entries(forbiddenUsages)) {
      it(`${file} should NOT use ${forbiddenTokens.join(', ')}`, () => {
        const content = readComponent(file);
        for (const token of forbiddenTokens) {
          expect(content, `"${token}" should not appear in ${file}`).not.toContain(token);
        }
      });
    }
  });
});
