import type { Editor } from '@tiptap/core';
import type { Node as PmNode } from '@tiptap/pm/model';
import { NodeSelection } from '@tiptap/pm/state';
import { validateUrl, isCategoryHref, isStaticPageHref } from './url.helper';
import {
  rangeContainsInlineAtoms,
  rangeContainsAtoms,
  getLinkMark,
  getLinkAttrsFromRange,
  isAtomNode,
} from './helpers';
import type { LinkModalLinkAttrs } from '../types';

export const useLinkModal = (editor: Ref<Editor | null | undefined> | ComputedRef<Editor | null | undefined>) => {
  const tabs: { value: LinkTabValue; label: string }[] = [
    { value: 'url', label: 'URL' },
    { value: 'static', label: 'Static page' },
    { value: 'category', label: 'Category' },
  ];

  const relValues = ref<string[]>([]);
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
  const originalAtomLinkFullAttrs = ref<({ href: string; target: string } & LinkModalLinkAttrs) | null>(null);
  const atomDisplayLabel = ref<string | null>(null);
  const initialLinkAttrs = ref<LinkModalLinkAttrs | null>(null);
  const initialSelection = ref<{ from: number; to: number } | null>(null);
  const initialText = ref('');

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

  const extractLinkAttrs = (rawAttrs?: LinkModalLinkAttrs): LinkModalLinkAttrs => ({
    href: rawAttrs?.href,
    target: rawAttrs?.target,
    rel: rawAttrs?.rel,
    'data-link-rel': rawAttrs?.['data-link-rel'],
    'data-link-type': rawAttrs?.['data-link-type'],
    'data-link-value': rawAttrs?.['data-link-value'],
    'data-link-path': rawAttrs?.['data-link-path'],
  });

  const hydrateModalStateFromAttrs = (attrs: LinkModalLinkAttrs) => {
    if (!attrs.href) return;

    openInNewWindow.value = attrs.target === '_blank';
    const existingRel = (attrs.rel ?? '')
      .split(' ')
      .map((s) => s.trim())
      .filter((s) => s && s !== 'none');
    relValues.value = attrs['data-link-rel']
      ? attrs['data-link-rel']
          .split(' ')
          .map((s) => s.trim())
          .filter((s) => s && s !== 'none')
      : existingRel;
    const storedLinkType = attrs['data-link-type'];
    const storedLinkValue = attrs['data-link-value'];
    const storedLinkPath = attrs['data-link-path'];

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
      return;
    }

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
  };

  const buildCurrentLinkAttrs = (
    href: string,
    target: string,
  ): ({ href: string; target: string } & LinkModalLinkAttrs) | null => {
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
    const rel = relValues.value.filter((v) => v !== 'none');
    attrs.rel = rel.length ? rel.join(' ') : undefined;
    attrs['data-link-rel'] = rel.length ? rel.join(' ') : undefined;
    return attrs;
  };

  const buildInitialLinkAttrs = (): ({ href: string; target?: string } & LinkModalLinkAttrs) | null => {
    if (!initialLinkAttrs.value?.href) return null;
    return {
      href: initialLinkAttrs.value.href,
      target: initialLinkAttrs.value.target,
      rel: initialLinkAttrs.value.rel,
      'data-link-rel': initialLinkAttrs.value['data-link-rel'],
      'data-link-type': initialLinkAttrs.value['data-link-type'],
      'data-link-value': initialLinkAttrs.value['data-link-value'],
      'data-link-path': initialLinkAttrs.value['data-link-path'],
    };
  };

  const initFromEditor = () => {
    if (!editor.value) return;
    isInitializing.value = true;
    relValues.value = [];
    activeTab.value = 'url';
    urlValue.value = '';
    staticPageValue.value = '';
    categoryValue.value = null;
    selectedCategoryPath.value = null;
    openInNewWindow.value = false;
    linkText.value = '';
    const sel = editor.value.state.selection;
    const { from, to } = sel;
    initialSelection.value = { from, to };

    const isNodeSel = sel instanceof NodeSelection;
    const isInlineAtomNodeSel = isNodeSel && (sel as NodeSelection).node.isAtom && (sel as NodeSelection).node.isInline;
    isInlineAtomNodeSelection.value = isInlineAtomNodeSel;
    isAtomSelection.value = isInlineAtomNodeSel || rangeContainsAtoms(editor.value.state.doc, from, to);

    if (!isAtomSelection.value) {
      selectionContainsInlineAtoms.value = rangeContainsInlineAtoms(editor.value.state.doc, from, to);
      linkText.value = selectedText.value;
      initialText.value = selectedText.value;

      const attrs = extractLinkAttrs((getLinkMark(editor.value, from, to)?.attrs ?? {}) as LinkModalLinkAttrs);

      initialLinkAttrs.value = attrs;
      hydrateModalStateFromAttrs(attrs);

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
      : 'generic-atom-text';
    const linkMark =
      node?.marks.find((m) => m.type.name === 'link') ?? rangeAtomNode?.marks.find((m) => m.type.name === 'link');
    const attrs = linkMark
      ? extractLinkAttrs(linkMark.attrs as LinkModalLinkAttrs)
      : isInlineAtomNodeSel
        ? null
        : extractLinkAttrs(getLinkAttrsFromRange(editor.value.state.doc, from, to) ?? undefined);

    originalAtomLinkFullAttrs.value = attrs?.href
      ? {
          href: attrs.href,
          target: attrs.target ?? '_self',
          rel: attrs.rel,
          'data-link-rel': attrs['data-link-rel'],
          'data-link-type': attrs['data-link-type'],
          'data-link-value': attrs['data-link-value'],
          'data-link-path': attrs['data-link-path'],
        }
      : null;

    if (attrs) hydrateModalStateFromAttrs(attrs);

    isInitializing.value = false;
  };

  const applyAtomLink = (linkAttrs: ({ href: string; target: string } & LinkModalLinkAttrs) | null) => {
    if (isInitializing.value) return;
    if (!editor.value || !initialSelection.value) return;
    const chain = editor.value.chain();
    isInlineAtomNodeSelection.value
      ? chain.setNodeSelection(initialSelection.value.from)
      : chain.setTextSelection(initialSelection.value);
    linkAttrs ? chain.setLink(linkAttrs) : chain.unsetLink();
    chain.run();
  };

  const applyLivePreview = () => {
    if (!editor.value || !initialSelection.value || isInitializing.value) return;

    const href = computedHref.value;
    const target = openInNewWindow.value ? '_blank' : '_self';
    const linkAttrs = buildCurrentLinkAttrs(href, target);

    if (isAtomSelection.value) {
      applyAtomLink(linkAttrs);
      return;
    }

    if (selectionContainsInlineAtoms.value) {
      const chain = editor.value.chain().setTextSelection(initialSelection.value);
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

    linkAttrs ? chain.setLink(linkAttrs) : chain.unsetLink();

    chain.run();
  };

  watch(
    [linkText, urlValue, staticPageValue, categoryValue, selectedCategoryPath, openInNewWindow, activeTab, relValues],
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
        applyAtomLink(originalAtomLinkFullAttrs.value);
      } else if (selectionContainsInlineAtoms.value) {
        const chain = editor.value.chain().setTextSelection(initialSelection.value);
        const revertAttrs = buildInitialLinkAttrs();
        if (revertAttrs) {
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

        const linkAttrs = buildInitialLinkAttrs();
        if (linkAttrs) {
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
    relValues,
  };
};
