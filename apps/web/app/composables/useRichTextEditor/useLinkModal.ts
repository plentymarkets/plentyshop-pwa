import type { Editor } from '@tiptap/core';
import type { Node as PmNode } from '@tiptap/pm/model';
import { NodeSelection } from '@tiptap/pm/state';
import { validateUrl } from '~/composables/useRichTextEditor/helpers/url.helper';

const rangeContainsAtoms = (doc: PmNode, from: number, to: number) => {
  let found = false;
  doc.nodesBetween(from, to, (n) => {
    if (!found && n.isAtom && n.isInline) {
      found = true;
    }
    return !found;
  });
  return found;
};

const getLinkAttrsFromRange = (doc: PmNode, from: number, to: number) => {
  let result: { href: string; target: string } | null = null;
  doc.nodesBetween(from, to, (n) => {
    if (result) return false;
    const m = n.marks.find((m) => m.type.name === 'link');
    if (m) result = { href: m.attrs.href as string, target: m.attrs.target as string };
  });
  return result;
};

export const useLinkModal = (editor: Ref<Editor | null | undefined> | ComputedRef<Editor | null | undefined>) => {
  const tabs: { value: LinkTabValue; label: string }[] = [
    { value: 'url', label: 'URL' },
    { value: 'static', label: 'Static page' },
    { value: 'category', label: 'Category' },
  ];

  const activeTab = ref<LinkTabValue>('url');
  const urlValue = ref('');
  const staticPageValue = ref('');
  const openInNewWindow = ref(false);
  const categoryValue = ref<string | null>(null);
  const selectedCategoryPath = ref<string | null>(null);
  const linkText = ref('');
  const isAtomSelection = ref(false);
  const isInlineAtomNodeSelection = ref(false);
  const isInitializing = ref(false);
  const originalAtomLinkAttrs = ref<{ href: string; target: string } | null>(null);
  const atomDisplayLabel = ref<string | null>(null);

  const { getCorrectPreviewPathWithLocale } = useCategoryIdHelper();

  const categoryHref = computed(() => {
    if (!selectedCategoryPath.value) return '';
    return getCorrectPreviewPathWithLocale(selectedCategoryPath.value);
  });

  const selectedText = computed(() => {
    if (!editor.value) return '';
    const { from, to } = editor.value.state.selection;
    return editor.value.state.doc.textBetween(from, to, ' ');
  });

  const initialSelection = ref<{ from: number; to: number } | null>(null);
  const initialText = ref('');

  const initFromEditor = () => {
    if (!editor.value) return;
    isInitializing.value = true;
    const sel = editor.value.state.selection;
    const { from, to } = sel;
    initialSelection.value = { from, to };
    const isNodeSel = sel instanceof NodeSelection;
    const isInlineAtomNodeSel = isNodeSel && (sel as NodeSelection).node.isAtom && (sel as NodeSelection).node.isInline;
    isInlineAtomNodeSelection.value = isInlineAtomNodeSel;
    isAtomSelection.value = isInlineAtomNodeSel || rangeContainsAtoms(editor.value.state.doc, from, to);
    if (!isAtomSelection.value) {
      linkText.value = initialText.value = selectedText.value;
      const attrs = editor.value.getAttributes('link');
      if (attrs.href) {
        urlValue.value = attrs.href as string;
        openInNewWindow.value = attrs.target === '_blank';
      }
      isInitializing.value = false;
      return;
    }
    const node = isInlineAtomNodeSel ? (sel as NodeSelection).node : null;
    atomDisplayLabel.value = node
      ? `${(node.attrs.name as string) ?? node.type.name} [${node.type.name === 'emoji' ? 'emoji' : 'icon'}]`
      : 'generic-atom-text';
    const linkMark = node?.marks.find((m) => m.type.name === 'link');
    originalAtomLinkAttrs.value = linkMark
      ? { href: linkMark.attrs.href as string, target: linkMark.attrs.target as string }
      : isNodeSel
        ? null
        : getLinkAttrsFromRange(editor.value.state.doc, from, to);
    if (originalAtomLinkAttrs.value) {
      urlValue.value = originalAtomLinkAttrs.value.href;
      openInNewWindow.value = originalAtomLinkAttrs.value.target === '_blank';
    }
    isInitializing.value = false;
  };

  const applyAtomLink = (href: string, target: string) => {
    if (!editor.value || !initialSelection.value) return;
    const chain = editor.value.chain();
    isInlineAtomNodeSelection.value
      ? chain.setNodeSelection(initialSelection.value.from)
      : chain.setTextSelection(initialSelection.value);
    href ? chain.setLink({ href, target }) : chain.unsetLink();
    chain.run();
  };

  const applyLivePreview = () => {
    if (!editor.value || !initialSelection.value || isInitializing.value) return;

    const href = computedHref.value;
    const isExternalUrl = activeTab.value === 'url';
    const target = isExternalUrl || openInNewWindow.value ? '_blank' : '_self';

    if (isAtomSelection.value) {
      applyAtomLink(href, target);
      return;
    }

    const text = linkText.value.trim() || initialText.value;
    const { from } = initialSelection.value;
    const chain = editor.value.chain();

    chain.setTextSelection(initialSelection.value).deleteSelection().insertContent(text);

    initialSelection.value = { from, to: from + text.length };

    chain.setTextSelection(initialSelection.value);

    if (href) {
      chain.setLink({ href, target });
    } else {
      chain.unsetLink();
    }

    chain.run();
  };

  watch([linkText, urlValue, staticPageValue, categoryValue, openInNewWindow], applyLivePreview);

  const computedHref = computed(() => {
    if (activeTab.value === 'url') return urlValue.value.trim();

    if (activeTab.value === 'static') {
      return staticPageValue.value ? getCorrectPreviewPathWithLocale(staticPageValue.value) : '';
    }

    if (activeTab.value === 'category') return categoryHref.value;

    return '';
  });

  const canSubmit = computed(() => {
    if (activeTab.value === 'url') return validateUrl(urlValue.value);
    if (activeTab.value === 'category') return Boolean(categoryHref.value);
    return Boolean(computedHref.value);
  });

  const handleSubmit = (onClose: () => void) => {
    if (!canSubmit.value || !editor.value) return;
    onClose();
  };

  const cancelAndRevert = (onClose: () => void) => {
    if (editor.value && initialSelection.value) {
      if (isAtomSelection.value) {
        const attrs = originalAtomLinkAttrs.value;
        applyAtomLink(attrs?.href ?? '', attrs?.target ?? '_self');
      } else {
        const chain = editor.value.chain();
        chain.setTextSelection(initialSelection.value).deleteSelection().insertContent(initialText.value);
        const { from } = initialSelection.value;
        const to = from + initialText.value.length;
        chain.setTextSelection({ from, to });
        const originalAttrs = editor.value.getAttributes('link');
        originalAttrs.href
          ? chain.setLink({ href: originalAttrs.href, target: originalAttrs.target })
          : chain.unsetLink();
        chain.run();
      }
    }
    onClose();
  };
  return {
    activeTab,
    urlValue,
    staticPageValue,
    categoryValue,
    selectedCategoryPath,
    openInNewWindow,
    linkText,
    isAtomSelection,
    atomDisplayLabel,
    computedHref,
    canSubmit,
    tabs,
    initFromEditor,
    handleSubmit,
    cancelAndRevert,
  };
};
