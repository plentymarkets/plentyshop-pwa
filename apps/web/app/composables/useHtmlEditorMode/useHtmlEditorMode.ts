import type { EditorMode, UseHtmlEditorModeOptions, HtmlToken } from './types';

const VOID_ELEMENTS = new Set([
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

type QuoteState = 'none' | 'single' | 'double';

function nextQuoteState(currentState: QuoteState, character: string): QuoteState {
  if (currentState === 'none') {
    if (character === "'") return 'single';
    if (character === '"') return 'double';
    return 'none';
  }

  if (currentState === 'single') {
    return character === "'" ? 'none' : 'single';
  }

  return character === '"' ? 'none' : 'double';
}

function findTagEndIndex(source: string, openingBracketIndex: number): number {
  let quoteState: QuoteState = 'none';

  for (let index = openingBracketIndex + 1; index < source.length; index++) {
    const character = source.charAt(index);
    quoteState = nextQuoteState(quoteState, character);

    if (character === '>' && quoteState === 'none') return index;
  }

  return -1;
}

function parseTagNameAndAttributes(tagInner: string): { tagName: string; attributesSource: string } | null {
  const trimmedInner = tagInner.trim();
  if (!trimmedInner) return null;

  const match = trimmedInner.match(/^([a-zA-Z][\w:-]*)\b([\s\S]*)$/);
  const tagName = match?.[1];
  if (!tagName) return null;

  return { tagName: tagName.toLowerCase(), attributesSource: (match?.[2] ?? '').trim() };
}

function detectSelfClosingTag(tagInnerWithoutClosingSlash: string, fullTag: string): boolean {
  return fullTag.endsWith('/>') || /\/\s*$/.test(tagInnerWithoutClosingSlash.trim());
}

function tokenizeHtml(source: string): HtmlToken[] {
  const tokens: HtmlToken[] = [];

  for (let cursor = 0; cursor < source.length; cursor++) {
    if (source.charAt(cursor) !== '<') continue;

    if (source.startsWith('<!--', cursor)) {
      const commentEnd = source.indexOf('-->', cursor + 4);
      if (commentEnd === -1) break;
      tokens.push({ kind: 'comment' });
      cursor = commentEnd + 2;
      continue;
    }

    if (source.startsWith('<?', cursor)) {
      const instructionEnd = source.indexOf('?>', cursor + 2);
      if (instructionEnd === -1) break;
      tokens.push({ kind: 'processing-instruction' });
      cursor = instructionEnd + 1;
      continue;
    }

    const tagEndIndex = findTagEndIndex(source, cursor);
    if (tagEndIndex === -1) break;

    const fullTag = source.slice(cursor, tagEndIndex + 1);
    const tagInner = fullTag.slice(1, -1).trim();
    const lowerFullTag = fullTag.toLowerCase();

    if (lowerFullTag.startsWith('<!doctype') || tagInner.startsWith('!')) {
      tokens.push({ kind: 'doctype' });
      cursor = tagEndIndex;
      continue;
    }

    const isClosing = tagInner.startsWith('/');
    const tagInnerWithoutSlash = isClosing ? tagInner.slice(1).trim() : tagInner;

    const parsed = parseTagNameAndAttributes(tagInnerWithoutSlash);
    if (!parsed) {
      cursor = tagEndIndex;
      continue;
    }

    const isSelfClosing = detectSelfClosingTag(tagInnerWithoutSlash, fullTag);

    tokens.push({
      kind: 'tag',
      tagName: parsed.tagName,
      attributesSource: parsed.attributesSource,
      isClosing,
      isSelfClosing,
    });

    if (!isClosing && !isSelfClosing && (parsed.tagName === 'script' || parsed.tagName === 'style')) {
      const closingTag = `</${parsed.tagName}>`;
      const closingIndex = source.toLowerCase().indexOf(closingTag, tagEndIndex + 1);
      if (closingIndex !== -1) {
        cursor = Math.max(tagEndIndex, closingIndex - 1);
        continue;
      }
    }

    cursor = tagEndIndex;
  }

  return tokens;
}

function countUnescapedOccurrences(text: string, quoteCharacter: '"' | "'"): number {
  let count = 0;

  for (let index = 0; index < text.length; index++) {
    const character = text.charAt(index);

    if (character === '\\') {
      index += 1;
      continue;
    }

    if (character === quoteCharacter) count += 1;
  }

  return count;
}

export function useHtmlEditorMode(contentModel: Ref<string>, options: UseHtmlEditorModeOptions = {}) {
  const { defaultMode = 'wysiwyg', commitOnValid = true, maxErrors = 5 } = options;

  const editorMode = ref<EditorMode>(defaultMode);
  const htmlDraft = ref(contentModel.value ?? '');
  const htmlErrors = ref<string[]>([]);

  function validateHtmlSyntax(htmlSource: string): string[] {
    const trimmedSource = (htmlSource ?? '').trim();
    if (!trimmedSource) return [];

    const errors: string[] = [];

    const lastOpeningBracketIndex = trimmedSource.lastIndexOf('<');
    const lastClosingBracketIndex = trimmedSource.lastIndexOf('>');
    if (lastOpeningBracketIndex > lastClosingBracketIndex) {
      const remaining = trimmedSource.slice(lastOpeningBracketIndex);
      if (/^<\s*[a-zA-Z!/]/.test(remaining)) {
        errors.push('Found "<" without a closing ">".');
      }
    }

    const openTagStack: string[] = [];

    for (const token of tokenizeHtml(trimmedSource)) {
      if (token.kind !== 'tag') continue;

      const { tagName, attributesSource, isClosing, isSelfClosing } = token;

      if (countUnescapedOccurrences(attributesSource, '"') % 2 !== 0) {
        errors.push(`Unclosed double quote in <${tagName}> attributes.`);
      }

      if (countUnescapedOccurrences(attributesSource, "'") % 2 !== 0) {
        errors.push(`Unclosed single quote in <${tagName}> attributes.`);
      }

      if (isSelfClosing || VOID_ELEMENTS.has(tagName)) continue;

      if (!isClosing) {
        openTagStack.push(tagName);
        continue;
      }

      const expectedTagName = openTagStack[openTagStack.length - 1];
      if (!expectedTagName) {
        errors.push(`Unexpected closing tag </${tagName}>.`);
        continue;
      }

      if (expectedTagName !== tagName) {
        errors.push(`Mismatched closing tag </${tagName}>. Expected </${expectedTagName}>.`);
        continue;
      }

      openTagStack.pop();
    }

    if (openTagStack.length) {
      const unclosedTags = openTagStack
        .slice(-3)
        .reverse()
        .map((tagName) => `<${tagName}>`)
        .join(', ');
      errors.push(`Unclosed tag(s): ${unclosedTags}.`);
    }

    return Array.from(new Set(errors)).slice(0, maxErrors);
  }

  const ariaDescribedBy = computed(() => (htmlErrors.value.length ? 'html-editor-errors' : undefined));

  function validateAndCommitIfAllowed(nextDraft: string) {
    const nextErrors = validateHtmlSyntax(nextDraft);
    htmlErrors.value = nextErrors;

    if (!commitOnValid) return;
    if (nextErrors.length) return;

    contentModel.value = nextDraft;
  }

  function switchToHtmlMode() {
    editorMode.value = 'html';
    htmlDraft.value = contentModel.value ?? '';
    validateAndCommitIfAllowed(htmlDraft.value);
  }

  function switchToWysiwygMode() {
    editorMode.value = 'wysiwyg';
    if (!commitOnValid) {
      htmlErrors.value = validateHtmlSyntax(htmlDraft.value);
      if (!htmlErrors.value.length) contentModel.value = htmlDraft.value;
    }
  }

  watch(
    () => editorMode.value,
    (mode) => {
      if (mode === 'html') {
        htmlDraft.value = contentModel.value ?? '';
        validateAndCommitIfAllowed(htmlDraft.value);
      } else {
        switchToWysiwygMode();
      }
    },
    { immediate: true },
  );

  watch(
    () => htmlDraft.value,
    (nextDraft) => {
      if (editorMode.value !== 'html') return;
      validateAndCommitIfAllowed(nextDraft);
    },
  );

  watch(
    () => contentModel.value,
    (nextValue) => {
      if (editorMode.value !== 'wysiwyg') return;
      htmlDraft.value = nextValue ?? '';
    },
  );

  return {
    editorMode,
    htmlDraft,
    htmlErrors,
    ariaDescribedBy,
    validateHtmlSyntax,
    switchToHtmlMode,
    switchToWysiwygMode,
  };
}
