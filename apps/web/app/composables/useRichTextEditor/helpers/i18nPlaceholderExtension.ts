import { Node, mergeAttributes } from '@tiptap/core';
import type { NodeViewRenderer } from '@tiptap/core';
import { VueNodeViewRenderer } from '@tiptap/vue-3';
import I18nPlaceholderView from '~/components/editor/RichTextEditor/I18nPlaceholderView.vue';
import type { I18nPlaceholderOptions } from '../types';
import { getI18nPlaceholderDisplayLabel, getI18nPlaceholderTitle } from '~/utils/i18nPlaceholders';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    i18nPlaceholder: {
      insertI18nPlaceholder: (key: string, label?: string) => ReturnType;
    };
  }
}

export const I18nPlaceholderNode: Node<I18nPlaceholderOptions> = Node.create<I18nPlaceholderOptions>({
  name: 'i18nPlaceholder',
  group: 'inline',
  inline: true,
  atom: true,
  selectable: true,
  draggable: false,

  addOptions() {
    return { HTMLAttributes: {} };
  },

  addAttributes() {
    return {
      key: {
        default: null,
        parseHTML: (element: HTMLElement) => element.dataset.i18nKey ?? null,
        renderHTML: () => null,
      },
      label: {
        default: null,
        parseHTML: (element: HTMLElement) => element.dataset.i18nLabel ?? element.textContent,
        renderHTML: () => null,
      },
    };
  },

  parseHTML() {
    return [{ tag: 'span[data-i18n-key]' }];
  },

  renderHTML({ node, HTMLAttributes }) {
    const displayLabel = getI18nPlaceholderDisplayLabel(node.attrs.key, node.attrs.label);
    const title = getI18nPlaceholderTitle(node.attrs.key, node.attrs.label);

    return [
      'span',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        'data-i18n-key': node.attrs.key,
        title: `i18n: ${title}`,
        class: 'rte-i18n-placeholder',
        contenteditable: 'false',
      }),
      displayLabel,
    ];
  },

  addNodeView(): NodeViewRenderer {
    return VueNodeViewRenderer(I18nPlaceholderView);
  },

  addCommands() {
    return {
      insertI18nPlaceholder:
        (key: string, label?: string) =>
        ({ chain }) => {
          return chain()
            .focus()
            .insertContent({
              type: this.name,
              attrs: {
                key,
                label: label ?? key,
              },
            })
            .run();
        },
    };
  },
});
