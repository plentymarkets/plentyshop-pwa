import type { EditorMode, UseHtmlEditorModeOptions } from './types';

export function useHtmlEditorMode(contentModel: Ref<string>, options: UseHtmlEditorModeOptions = {}) {
  const { defaultMode = 'wysiwyg', commitOnValid = true, maxErrors = 5 } = options;

  const editorMode = ref<EditorMode>(defaultMode);
  const htmlDraft = ref(contentModel.value ?? '');
  const htmlErrors = ref<string[]>([]);

  function validateHtmlSyntax(htmlSource: string): string[] {
    const source = (htmlSource ?? '').trim();
    if (!source) return [];

    const validationErrors: string[] = [];

    const lastOpeningBracketIndex = source.lastIndexOf('<');
    const lastClosingBracketIndex = source.lastIndexOf('>');
    if (lastOpeningBracketIndex > lastClosingBracketIndex) {
      validationErrors.push('Found "<" without a closing ">".');
    }

    const tagMatcher = /<!--[\s\S]*?-->|<!doctype[\s\S]*?>|<\?[\s\S]*?\?>|<\/?([a-zA-Z][\w:-]*)\b([^>]*)>/g;

    const voidElements = new Set([
      'area',
      'base',
      'br',
      'col',
      'embed',
      'hr',
      'img',
      'input',
      'link',
      'meta',
      'param',
      'source',
      'track',
      'wbr',
    ]);

    const openTagStack: string[] = [];

    let match: RegExpExecArray | null;

    while ((match = tagMatcher.exec(source))) {
      const fullTag = match[0];
      const tagName = (match[1] || '').toLowerCase();
      const attributeString = match[2] || '';

      if (fullTag.startsWith('<!--') || fullTag.toLowerCase().startsWith('<!doctype') || fullTag.startsWith('<?')) {
        continue;
      }

      const doubleQuoteCount = (attributeString.match(/"/g) || []).length;
      const singleQuoteCount = (attributeString.match(/'/g) || []).length;

      if (doubleQuoteCount % 2 !== 0) {
        validationErrors.push(`Unclosed double quote in <${tagName}> attributes.`);
      }
      if (singleQuoteCount % 2 !== 0) {
        validationErrors.push(`Unclosed single quote in <${tagName}> attributes.`);
      }

      const isClosingTag = fullTag.startsWith('</');
      const isSelfClosingTag = fullTag.endsWith('/>') || voidElements.has(tagName);

      if (isSelfClosingTag) continue;

      if (!isClosingTag) {
        openTagStack.push(tagName);
        continue;
      }

      const expectedTag = openTagStack.pop();

      if (!expectedTag) {
        validationErrors.push(`Unexpected closing tag </${tagName}>.`);
        continue;
      }

      if (expectedTag !== tagName) {
        validationErrors.push(`Mismatched closing tag </${tagName}>. Expected </${expectedTag}>.`);
        openTagStack.push(expectedTag);
      }
    }

    if (openTagStack.length) {
      const unclosedTags = openTagStack
        .slice(-3)
        .reverse()
        .map((tag) => `<${tag}>`)
        .join(', ');

      validationErrors.push(`Unclosed tag(s): ${unclosedTags}.`);
    }

    return Array.from(new Set(validationErrors)).slice(0, maxErrors);
  }

  function validateAndCommitIfAllowed(nextHtml: string) {
    const errors = validateHtmlSyntax(nextHtml ?? '');
    htmlErrors.value = errors;

    if (commitOnValid && errors.length === 0) {
      contentModel.value = nextHtml ?? '';
    }
  }

  watch(contentModel, (newValue) => {
    if (editorMode.value === 'wysiwyg') {
      htmlDraft.value = newValue ?? '';
    }
  });

  watch(editorMode, (newMode) => {
    if (newMode === 'html') {
      htmlDraft.value = contentModel.value ?? '';
      htmlErrors.value = validateHtmlSyntax(htmlDraft.value);
    }
  });

  watch(htmlDraft, (newDraft) => {
    if (editorMode.value !== 'html') return;
    validateAndCommitIfAllowed(newDraft ?? '');
  });

  const ariaDescribedBy = computed(() => (htmlErrors.value.length > 0 ? 'html-editor-errors' : undefined));

  return {
    editorMode,
    htmlDraft,
    htmlErrors,
    ariaDescribedBy,
    validateHtmlSyntax,
  };
}
