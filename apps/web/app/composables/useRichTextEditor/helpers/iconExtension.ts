import { Node, mergeAttributes } from '@tiptap/core';
import { useIconRegistry } from '~/composables/useIconRegistry';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    icon: {
      insertIcon: (name: string) => ReturnType;
    };
  }
}

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

  renderHTML({ HTMLAttributes }) {
    const name = HTMLAttributes['data-icon'] as string | undefined;
    const { getIcon } = useIconRegistry();
    const icon = name ? getIcon(name) : undefined;

    return [
      'span',
      mergeAttributes(HTMLAttributes, {
        class: 'rte-icon',
        ...(icon ? { title: icon.label, 'aria-label': icon.label } : {}),
      }),
    ];
  },

  addNodeView() {
    return ({ node }) => {
      const { renderToSvgString, getIcon } = useIconRegistry();
      const name = node.attrs.name as string | null;
      const icon = name ? getIcon(name) : undefined;

      const dom = document.createElement('span');
      dom.classList.add('rte-icon');
      if (name) dom.setAttribute('data-icon', name);
      if (icon) {
        dom.setAttribute('title', icon.label);
        dom.setAttribute('aria-label', icon.label);
        dom.innerHTML = renderToSvgString(name!) ?? '';
      } else {
        dom.classList.add('rte-icon--missing');
      }

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