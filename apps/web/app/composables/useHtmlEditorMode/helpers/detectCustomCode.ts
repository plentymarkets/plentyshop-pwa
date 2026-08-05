import type { CustomCodeHint } from '../types';

/**
 * Detects custom CSS and JavaScript in HTML content
 * and returns hints about the custom code settings.
 *
 * Detects <style> and <script> tags in HTML content.
 * Returns informational hints if found.
 */
export function detectCustomCode(htmlContent: string): CustomCodeHint[] {
  const hints: CustomCodeHint[] = [];
  const trimmedContent = (htmlContent ?? '').trim();

  if (!trimmedContent) {
    return hints;
  }

  const lowerContent = trimmedContent.toLowerCase();
  const hasStyleTag = /<style[\s>]/i.test(lowerContent);
  const hasScriptTag = /<script[\s>]/i.test(lowerContent);

  if (hasStyleTag) {
    hints.push({
      type: 'css',
      message: 'customCodeHint.cssDetected',
    });
  }

  if (hasScriptTag) {
    hints.push({
      type: 'js',
      message: 'customCodeHint.jsDetected',
    });
  }

  return hints;
}
