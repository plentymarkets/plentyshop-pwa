import { Node, mergeAttributes } from '@tiptap/core';
import { userIcons } from '~/components/editor/RichTextEditor/utils/icons';
import type { DOMOutputSpec } from '@tiptap/pm/model';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    icon: {
      insertIcon: (name: string) => ReturnType;
    };
  }
}

const buildSvg = (name: string | null | undefined): string | null => {
  if (!name) return null;
  const icon = userIcons[name];
  if (!icon) return null;

  const paths = icon.paths.map((d) => `<path d="${d}"/>`).join('');
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${icon.viewBox}" ` +
    `fill="currentColor" width="1em" height="1em" aria-hidden="true">${paths}</svg>`
  );
};

const buildIconElement = (name: string | null, extraAttrs: Record<string, unknown> = {}): HTMLElement => {
  const icon = name ? userIcons[name] : undefined;
  const svg = buildSvg(name);

  const attrs = mergeAttributes(extraAttrs, {
    class: 'rte-icon',
    ...(name ? { 'data-icon': name } : {}),
    ...(icon ? { title: icon.label, 'aria-label': icon.label } : {}),
  });

  const span = document.createElement('span');
  Object.entries(attrs).forEach(([k, v]) => span.setAttribute(k, String(v)));

  if (svg) {
    span.innerHTML = svg;
  } else {
    span.classList.add('rte-icon--missing');
  }

  return span;
};

export const IconNode = Node.create({
  name: 'icon',

  group: 'inline',
  inline: true,
  atom: true,
  selectable: true,
  marks: '_',
  draggable: false,

  addAttributes() {
    return {
      name: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-icon'),
        renderHTML: (attributes) => {
          if (!attributes.name) return {};
          return { 'data-icon': attributes.name };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'span[data-icon]',
        getAttrs: (element) => {
          if (!(element instanceof HTMLElement)) return false;
          const name = element.getAttribute('data-icon');
          if (!name) return false;
          return { name };
        },
      },
    ];
  },

  renderHTML({ node, HTMLAttributes }) {
    const span = buildIconElement(node.attrs.name as string | null, HTMLAttributes);
    return span as unknown as DOMOutputSpec;
  },

  addNodeView() {
    return ({ node }) => {
      const dom = buildIconElement(node.attrs.name as string | null);
      return { dom };
    };
  },

  addCommands() {
    return {
      insertIcon:
        (name: string) =>
        ({ chain }) =>
          chain().focus().insertContent({ type: this.name, attrs: { name } }).run(),
    };
  },
});
