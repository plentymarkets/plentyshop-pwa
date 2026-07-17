import type { Node as PmNode, Mark as PmMark } from '@tiptap/pm/model';
import type { Editor } from '@tiptap/core';
import {
  isAtomNode,
  rangeContainsInlineAtoms,
  rangeContainsAtoms,
  getLinkMark,
  getLinkAttrsFromRange,
} from '../helpers';

const makeNode = (overrides: object = {}): PmNode =>
  ({ isAtom: false, isInline: false, type: { name: 'text' }, marks: [], attrs: {}, ...overrides }) as unknown as PmNode;

const makeMark = (name: string, attrs: object = {}): PmMark => ({ type: { name }, attrs }) as unknown as PmMark;

const makeDoc = (nodes: PmNode[]): PmNode =>
  ({
    nodesBetween: vi.fn((_f: number, _t: number, cb: (n: PmNode) => boolean) => {
      for (const n of nodes) {
        if (cb(n) === false) break;
      }
    }),
  }) as unknown as PmNode;

const makeEditor = (
  opts: {
    nodesInRange?: PmNode[];
    storedMarks?: PmMark[] | null;
    cursorMarks?: PmMark[];
    from?: number;
    to?: number;
  } = {},
): Editor =>
  ({
    state: {
      doc: makeDoc(opts.nodesInRange ?? []),
      storedMarks: opts.storedMarks ?? null,
      selection: {
        from: opts.from ?? 0,
        to: opts.to ?? 5,
        $from: { marks: () => opts.cursorMarks ?? [] },
      },
    },
  }) as unknown as Editor;

describe('isAtomNode', () => {
  it('should return true for icon nodes', () => {
    expect(isAtomNode(makeNode({ type: { name: 'icon' } }))).toBe(true);
  });

  it('should return true for emoji nodes', () => {
    expect(isAtomNode(makeNode({ type: { name: 'emoji' } }))).toBe(true);
  });

  it('should return false for text nodes', () => {
    expect(isAtomNode(makeNode({ type: { name: 'text' } }))).toBe(false);
  });

  it('should return false for paragraph nodes', () => {
    expect(isAtomNode(makeNode({ type: { name: 'paragraph' } }))).toBe(false);
  });
});

describe('rangeContainsInlineAtoms', () => {
  it('should return false when the range has no nodes', () => {
    expect(rangeContainsInlineAtoms(makeDoc([]), 0, 5)).toBe(false);
  });

  it('should return false when the range has only regular nodes', () => {
    expect(rangeContainsInlineAtoms(makeDoc([makeNode()]), 0, 5)).toBe(false);
  });

  it('should return true when the range contains an inline atom', () => {
    const atom = makeNode({ isAtom: true, isInline: true, type: { name: 'icon' } });
    expect(rangeContainsInlineAtoms(makeDoc([atom]), 0, 5)).toBe(true);
  });

  it('should return false for block atoms (non-inline)', () => {
    const blockAtom = makeNode({ isAtom: true, isInline: false, type: { name: 'image' } });
    expect(rangeContainsInlineAtoms(makeDoc([blockAtom]), 0, 5)).toBe(false);
  });
});

describe('rangeContainsAtoms', () => {
  it('should return false when the range has no nodes', () => {
    expect(rangeContainsAtoms(makeDoc([]), 0, 5)).toBe(false);
  });

  it('should return false when the range has only text nodes', () => {
    expect(rangeContainsAtoms(makeDoc([makeNode()]), 0, 5)).toBe(false);
  });

  it('should return true when the range contains an icon node', () => {
    const icon = makeNode({ type: { name: 'icon' } });
    expect(rangeContainsAtoms(makeDoc([icon]), 0, 5)).toBe(true);
  });

  it('should return true when the range contains an emoji node', () => {
    const emoji = makeNode({ type: { name: 'emoji' } });
    expect(rangeContainsAtoms(makeDoc([emoji]), 0, 5)).toBe(true);
  });
});

describe('getLinkMark', () => {
  it('should return a link mark found within a range (from !== to)', () => {
    const linkMark = makeMark('link', { href: 'https://example.com', target: '_self' });
    const editor = makeEditor({ from: 0, to: 5, nodesInRange: [makeNode({ marks: [linkMark] })] });
    expect(getLinkMark(editor, 0, 5)).toBe(linkMark);
  });

  it('should return undefined when no link mark is found in range', () => {
    const editor = makeEditor({ from: 0, to: 5, nodesInRange: [makeNode()] });
    expect(getLinkMark(editor, 0, 5)).toBeUndefined();
  });

  it('should return a link mark from cursor marks when from === to', () => {
    const linkMark = makeMark('link', { href: 'https://cursor.com', target: '_self' });
    const editor = makeEditor({ from: 0, to: 0, cursorMarks: [linkMark] });
    expect(getLinkMark(editor, 0, 0)).toBe(linkMark);
  });

  it('should return a link mark from storedMarks when from === to', () => {
    const linkMark = makeMark('link', { href: 'https://stored.com', target: '_self' });
    const editor = makeEditor({ from: 0, to: 0, storedMarks: [linkMark] });
    expect(getLinkMark(editor, 0, 0)).toBe(linkMark);
  });

  it('should return undefined when cursor has no marks and from === to', () => {
    const editor = makeEditor({ from: 0, to: 0 });
    expect(getLinkMark(editor, 0, 0)).toBeUndefined();
  });

  it('should prefer range match over cursor fallback', () => {
    const rangeMark = makeMark('link', { href: 'https://range.com', target: '_self' });
    const cursorMark = makeMark('link', { href: 'https://cursor.com', target: '_self' });
    const editor = makeEditor({
      from: 0,
      to: 5,
      nodesInRange: [makeNode({ marks: [rangeMark] })],
      cursorMarks: [cursorMark],
    });
    expect(getLinkMark(editor, 0, 5)).toBe(rangeMark);
  });
});

describe('getLinkAttrsFromRange', () => {
  it('should return null when no node has a link mark', () => {
    expect(getLinkAttrsFromRange(makeDoc([makeNode()]), 0, 5)).toBeNull();
  });

  it('should return null for an empty range', () => {
    expect(getLinkAttrsFromRange(makeDoc([]), 0, 5)).toBeNull();
  });

  it('should return link attrs from the first node with a link mark', () => {
    const linkMark = makeMark('link', {
      href: 'https://example.com',
      target: '_self',
      'data-link-type': 'url',
      'data-link-value': 'https://example.com',
      'data-link-path': undefined,
    });
    const result = getLinkAttrsFromRange(makeDoc([makeNode({ marks: [linkMark] })]), 0, 5);
    expect(result).toMatchObject({
      href: 'https://example.com',
      target: '_self',
      'data-link-type': 'url',
    });
  });
});
