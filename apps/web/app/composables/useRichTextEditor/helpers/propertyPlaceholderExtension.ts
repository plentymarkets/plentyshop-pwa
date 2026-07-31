import { Node, mergeAttributes } from '@tiptap/core';
import type { NodeViewRenderer } from '@tiptap/core';
import { VueNodeViewRenderer } from '@tiptap/vue-3';
import PropertyPlaceholderView from '~/components/editor/RichTextEditor/PropertyPlaceholderView.vue';
import type { PropertyPlaceholderOptions, PropertyPlaceholderAttrs } from '../types';
import { getPropertyPlaceholderDisplayLabel } from '~/utils/propertyPlaceholders';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    propertyPlaceholder: {
      insertPropertyPlaceholder: (token: string, label: string, attrs?: PropertyPlaceholderAttrs) => ReturnType;
    };
  }
}

export const PropertyPlaceholderNode: Node<PropertyPlaceholderOptions> = Node.create<PropertyPlaceholderOptions>({
  name: 'propertyPlaceholder',
  group: 'inline',
  inline: true,
  atom: true,

  addOptions() {
    return { HTMLAttributes: {} };
  },

  addAttributes() {
    return {
      token: {
        default: null,
        parseHTML: (element: HTMLElement) => element.getAttribute('data-property-token'),
        renderHTML: () => null,
      },
      label: {
        default: null,
        parseHTML: (element: HTMLElement) => element.getAttribute('data-property-label') ?? element.textContent,
        renderHTML: () => null,
      },
      propertyId: {
        default: null,
        parseHTML: (element: HTMLElement) => {
          const propertyId = element.getAttribute('data-property-id');
          return propertyId ? Number(propertyId) : null;
        },
        renderHTML: () => null,
      },
      kind: {
        default: null,
        parseHTML: (element: HTMLElement) => element.getAttribute('data-property-kind'),
        renderHTML: () => null,
      },
      cast: {
        default: null,
        parseHTML: (element: HTMLElement) => element.getAttribute('data-property-cast'),
        renderHTML: () => null,
      },
    };
  },

  parseHTML() {
    return [{ tag: 'span[data-property-token]' }];
  },

  renderHTML({ node, HTMLAttributes }) {
    const displayLabel = getPropertyPlaceholderDisplayLabel(node.attrs.token, node.attrs.label);

    return [
      'span',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        'data-property-token': node.attrs.token,
        'data-property-label': displayLabel,
        'data-property-id': node.attrs.propertyId,
        'data-property-kind': node.attrs.kind,
        'data-property-cast': node.attrs.cast,
        title: displayLabel,
        class: 'rte-property-placeholder',
        contenteditable: 'false',
      }),
      displayLabel,
    ];
  },

  addNodeView(): NodeViewRenderer {
    return VueNodeViewRenderer(PropertyPlaceholderView);
  },

  addCommands() {
    return {
      insertPropertyPlaceholder:
        (token: string, label: string, attrs?: PropertyPlaceholderAttrs) =>
        ({ chain }) => {
          return chain()
            .focus()
            .insertContent({
              type: this.name,
              attrs: {
                token,
                label,
                propertyId: attrs?.propertyId ?? null,
                kind: attrs?.kind ?? null,
                cast: attrs?.cast ?? null,
              },
            })
            .run();
        },
    };
  },
});
