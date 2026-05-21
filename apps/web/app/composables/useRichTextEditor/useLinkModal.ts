import type { Editor } from '@tiptap/core';
import type { Mark as PmMark, Node as PmNode } from '@tiptap/pm/model';
import { NodeSelection } from '@tiptap/pm/state';
import { validateUrl } from '~/composables/useRichTextEditor/helpers/url.helper';
import type { LinkModalLinkAttrs } from '~/composables/useRichTextEditor/types';

const rangeContainsInlineAtoms = (doc: PmNode, from: number, to: number): boolean => {
  let found = false;
  doc.nodesBetween(from, to, (n) => {
    if (!found && n.isAtom && n.isInline) found = true;
    return !found;
  });
  return found;
};

const isAtomNode = (n: PmNode) => n.type.name === 'icon' || n.type.name === 'emoji';

const rangeContainsAtoms = (doc: PmNode, from: number, to: number) => {
  let found = false;
  doc.nodesBetween(from, to, (n) => {
    if (!found && isAtomNode(n)) {
      found = true;
    }
    return !found;
  });
  return found;
};

const getLinkMark = (editor: Editor, from: number, to: number): PmMark | undefined => {
  // Range selection: scan nodes in range
  if (from !== to) {
    let found: PmMark | undefined;
    editor.state.doc.nodesBetween(from, to, (n) => {
      if (!found) found = n.marks.find((m) => m.type.name === 'link');
      return !found;
    });
    if (found) return found;
  }
  // Collapsed cursor or fallback: check marks at cursor position
  const sel = editor.state.selection;
  const marks = [...(editor.state.storedMarks ?? []), ...sel.$from.marks()];
  return marks.find((m) => m.type.name === 'link');
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
  const selectionContainsInlineAtoms = ref(false);
  const isInitializing = ref(false);
  const originalAtomLinkAttrs = ref<{ href: string; target: string } | null>(null);
  const atomDisplayLabel = ref<string | null>(null);

  const { getCorrectPreviewPathWithLocale } = useCategoryIdHelper();

  const initialLinkAttrs = ref<LinkModalLinkAttrs | null>(null);

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

  const isCategoryHref = (href: string) => {
    return href.includes('/c/') || href.includes('/category/');
  };

  const isStaticPageHref = (href: string) => {
    return href.startsWith('/') && !isCategoryHref(href);
  };

  const initFromEditor = () => {
    if (!editor.value) return;
    isInitializing.value = true;

    const sel = editor.value.state.selection;
    const { from, to } = sel;
    initialSelection.value = { from, to };

    const isNodeSel = sel instanceof NodeSelection;
    const isInlineAtomNodeSel =
      isNodeSel && (sel as NodeSelection).node.type.name === 'icon';
    isInlineAtomNodeSelection.value = isInlineAtomNodeSel;
    isAtomSelection.value = isInlineAtomNodeSel || rangeContainsAtoms(editor.value.state.doc, from, to);

    if (!isAtomSelection.value) {
      selectionContainsInlineAtoms.value = rangeContainsInlineAtoms(editor.value.state.doc, from, to);
      linkText.value = selectedText.value;
      initialText.value = selectedText.value;

      const rawAttrs = (getLinkMark(editor.value, from, to)?.attrs ?? {}) as LinkModalLinkAttrs;
      const attrs: LinkModalLinkAttrs = {
        href: rawAttrs.href,
        target: rawAttrs.target,
        'data-link-type': rawAttrs['data-link-type'],
        'data-link-value': rawAttrs['data-link-value'],
        'data-link-path': rawAttrs['data-link-path'],
      };

      initialLinkAttrs.value = attrs;

      if (attrs.href) {
        openInNewWindow.value = attrs.target === '_blank';

        const storedLinkType = attrs['data-link-type'] as LinkTabValue | undefined;
        const storedLinkValue = attrs['data-link-value'] as string | undefined;
        const storedLinkPath = attrs['data-link-path'] as string | undefined;

        if (storedLinkType) {
          activeTab.value = storedLinkType;
          if (storedLinkType === 'url' && storedLinkValue) {
            urlValue.value = storedLinkValue;
          } else if (storedLinkType === 'static' && storedLinkValue) {
            staticPageValue.value = storedLinkValue;
          } else if (storedLinkType === 'category') {
            categoryValue.value = storedLinkValue ?? attrs.href ?? null;
            selectedCategoryPath.value = storedLinkPath || attrs.href || null;
          }
        } else {
          if (isCategoryHref(attrs.href)) {
            activeTab.value = 'category';
            categoryValue.value = attrs.href;
            selectedCategoryPath.value = attrs.href;
          } else if (isStaticPageHref(attrs.href)) {
            activeTab.value = 'static';
            staticPageValue.value = attrs.href;
          } else {
            activeTab.value = 'url';
            urlValue.value = attrs.href;
          }
        }
      }

      nextTick(() => {
        isInitializing.value = false;
      });
      return;
    }

    const node = isInlineAtomNodeSel ? (sel as NodeSelection).node : null;

    let rangeAtomNode: PmNode | null = null;
    if (!node) {
      const atomsInRange: PmNode[] = [];
      editor.value.state.doc.nodesBetween(from, to, (n) => {
        if (isAtomNode(n)) atomsInRange.push(n);
      });
      const pureAtomSelection = editor.value.state.doc.textBetween(from, to, ' ').trim().length === 0;
      if (atomsInRange.length === 1 && pureAtomSelection) rangeAtomNode = atomsInRange[0] ?? null;
    }

    const displayNode = node ?? rangeAtomNode;
    atomDisplayLabel.value = displayNode
      ? `${(displayNode.attrs.name as string) ?? displayNode.type.name} [${displayNode.type.name === 'emoji' ? 'emoji' : 'icon'}]`
      : 'Content with icon(s)';
    const linkMark = node?.marks.find((m) => m.type.name === 'link')
      ?? rangeAtomNode?.marks.find((m) => m.type.name === 'link');
    originalAtomLinkAttrs.value = linkMark
      ? { href: linkMark.attrs.href as string, target: linkMark.attrs.target as string }
      : isInlineAtomNodeSel
        ? null
        : getLinkAttrsFromRange(editor.value.state.doc, from, to);
    if (originalAtomLinkAttrs.value) {
      urlValue.value = originalAtomLinkAttrs.value.href;
      openInNewWindow.value = originalAtomLinkAttrs.value.target === '_blank';
    }
    isInitializing.value = false;
  };

  const applyAtomLink = (href: string, target: string) => {
    if (isInitializing.value) return;
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
    const target = openInNewWindow.value ? '_blank' : '_self';

    if (isAtomSelection.value) {
      applyAtomLink(href, target);
      return;
    }

    const buildLinkAttrs = (): ({ href: string; target: string } & LinkModalLinkAttrs) | null => {
      if (!href) return null;
      const attrs: { href: string; target: string } & LinkModalLinkAttrs = { href, target };
      attrs['data-link-type'] = activeTab.value;
      if (activeTab.value === 'url') {
        attrs['data-link-value'] = urlValue.value.trim();
      } else if (activeTab.value === 'static') {
        attrs['data-link-value'] = staticPageValue.value;
      } else if (activeTab.value === 'category') {
        if (categoryValue.value) attrs['data-link-value'] = categoryValue.value;
        if (selectedCategoryPath.value) attrs['data-link-path'] = selectedCategoryPath.value;
      }
      return attrs;
    };

    if (selectionContainsInlineAtoms.value) {
      const chain = editor.value.chain().setTextSelection(initialSelection.value);
      const linkAttrs = buildLinkAttrs();
      linkAttrs ? chain.setLink(linkAttrs) : chain.unsetLink();
      chain.run();
      return;
    }

    const text = linkText.value.trim() || initialText.value;
    const { from } = initialSelection.value;
    const chain = editor.value.chain();

    chain.setTextSelection(initialSelection.value).deleteSelection().insertContent(text);

    initialSelection.value = { from, to: from + text.length };

    chain.setTextSelection(initialSelection.value);

    const linkAttrs = buildLinkAttrs();
    linkAttrs ? chain.setLink(linkAttrs) : chain.unsetLink();

    chain.run();
  };

  watch(
    [linkText, urlValue, staticPageValue, categoryValue, selectedCategoryPath, openInNewWindow, activeTab],
    applyLivePreview,
  );
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
    applyLivePreview();
    onClose();
  };

  const cancelAndRevert = (onClose: () => void) => {
    if (editor.value && initialSelection.value) {
      if (isAtomSelection.value) {
        const attrs = originalAtomLinkAttrs.value;
        applyAtomLink(attrs?.href ?? '', attrs?.target ?? '_self');
      } else if (selectionContainsInlineAtoms.value) {
        const chain = editor.value.chain().setTextSelection(initialSelection.value);
        if (initialLinkAttrs.value?.href) {
          const revertAttrs: { href: string; target?: string } & LinkModalLinkAttrs = {
            href: initialLinkAttrs.value.href,
            target: initialLinkAttrs.value.target,
            'data-link-type': initialLinkAttrs.value['data-link-type'],
            'data-link-value': initialLinkAttrs.value['data-link-value'],
            'data-link-path': initialLinkAttrs.value['data-link-path'],
          };
          chain.setLink(revertAttrs);
        } else {
          chain.unsetLink();
        }
        chain.run();
      } else {
        const { from } = initialSelection.value;
        const to = from + initialText.value.length;

        const chain = editor.value.chain();

        chain
          .setTextSelection(initialSelection.value)
          .deleteSelection()
          .insertContent(initialText.value)
          .setTextSelection({ from, to });

        if (initialLinkAttrs.value?.href) {
          const initialHref = initialLinkAttrs.value.href;
          const linkAttrs: { href: string; target?: string } & LinkModalLinkAttrs = {
            href: initialHref,
            target: initialLinkAttrs.value.target,
            'data-link-type': initialLinkAttrs.value['data-link-type'],
            'data-link-value': initialLinkAttrs.value['data-link-value'],
            'data-link-path': initialLinkAttrs.value['data-link-path'],
          };

          chain.setLink(linkAttrs);
        } else {
          chain.unsetLink();
        }

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
