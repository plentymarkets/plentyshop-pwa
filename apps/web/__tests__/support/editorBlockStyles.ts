const EDITOR_BLOCK_STYLE_SELECTOR = '.block-hoverable';

const hasEditorBlockStyles = (window: Window) =>
  Array.from(window.document.styleSheets).some((styleSheet) => {
    try {
      return Array.from(styleSheet.cssRules).some((rule) => rule.cssText.includes(EDITOR_BLOCK_STYLE_SELECTOR));
    } catch {
      return false;
    }
  });

/**
 * Asserts whether the editor-only page block stylesheet is loaded in the browser.
 */
export const assertEditorBlockStylesLoaded = (expected: boolean) => {
  cy.window().should((window) => {
    expect(hasEditorBlockStyles(window), 'editor block styles loaded').to.equal(expected);
  });
};
