import type { Editor } from '@tiptap/core';
import type { Mark as PmMark, Node as PmNode } from '@tiptap/pm/model';
import type { LinkModalLinkAttrs } from '../types';

export const rangeContainsInlineAtoms = (doc: PmNode, from: number, to: number): boolean => {
  let found = false;
  doc.nodesBetween(from, to, (n) => {
    if (!found && n.isAtom && n.isInline) found = true;
    return !found;
  });
  return found;
};

export const isAtomNode = (n: PmNode) => n.type.name === 'icon' || n.type.name === 'emoji';

export const rangeContainsAtoms = (doc: PmNode, from: number, to: number) => {
  let found = false;
  doc.nodesBetween(from, to, (n) => {
    if (!found && isAtomNode(n)) {
      found = true;
    }
    return !found;
  });
  return found;
};

export const getLinkMark = (editor: Editor, from: number, to: number): PmMark | undefined => {
  if (from !== to) {
    let found: PmMark | undefined;
    editor.state.doc.nodesBetween(from, to, (n) => {
      if (!found) found = n.marks.find((m) => m.type.name === 'link');
      return !found;
    });
    if (found) return found;
  }
  const sel = editor.state.selection;
  const marks = [...(editor.state.storedMarks ?? []), ...sel.$from.marks()];
  return marks.find((m) => m.type.name === 'link');
};

export const getLinkAttrsFromRange = (doc: PmNode, from: number, to: number) => {
  let result: LinkModalLinkAttrs | null = null;
  doc.nodesBetween(from, to, (n) => {
    if (result) return false;
    const m = n.marks.find((m) => m.type.name === 'link');
    if (m) {
      result = {
        href: m.attrs.href as string,
        target: m.attrs.target as string,
        rel: m.attrs.rel as string | undefined,
        'data-link-rel': m.attrs['data-link-rel'] as string | undefined,
        'data-link-type': m.attrs['data-link-type'] as LinkModalLinkAttrs['data-link-type'],
        'data-link-value': m.attrs['data-link-value'] as string | undefined,
        'data-link-path': m.attrs['data-link-path'] as string | undefined,
      };
    }
  });
  return result;
};
