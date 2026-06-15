import Link from '@tiptap/extension-link';

/**
 * Extended TipTap Link mark that persists link-type metadata as HTML attributes.
 *
 * The additional attributes allow the link modal to restore the correct tab and
 * pre-fill all form fields when an existing link is opened for editing.
 *
 * - `data-link-type`  – one of `'url' | 'static' | 'category'`
 * - `data-link-value` – the original value before locale/path transformation
 *   (static page path or category ID)
 * - `data-link-path`  – raw category path (only set for `category` type),
 *   used to reconstruct the href without waiting for the async category select
 * - `data-link-rel`   – exact rel options selected in the modal
 */
export const CustomLink = Link.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      'data-link-type': {
        default: null,
        parseHTML: (element) => element.getAttribute('data-link-type'),
        renderHTML: (attributes) => {
          if (!attributes['data-link-type']) return {};
          return { 'data-link-type': attributes['data-link-type'] };
        },
      },
      'data-link-value': {
        default: null,
        parseHTML: (element) => element.getAttribute('data-link-value'),
        renderHTML: (attributes) => {
          if (!attributes['data-link-value']) return {};
          return { 'data-link-value': attributes['data-link-value'] };
        },
      },
      'data-link-path': {
        default: null,
        parseHTML: (element) => element.getAttribute('data-link-path'),
        renderHTML: (attributes) => {
          if (!attributes['data-link-path']) return {};
          return { 'data-link-path': attributes['data-link-path'] };
        },
      },
      'data-link-rel': {
        default: null,
        parseHTML: (element) => element.getAttribute('data-link-rel'),
        renderHTML: (attributes) => {
          if (!attributes['data-link-rel']) return {};
          return { 'data-link-rel': attributes['data-link-rel'] };
        },
      },

      rel: {
        default: null,
        parseHTML: (el) => el.getAttribute('rel'),
        renderHTML: (attrs) => {
          if (!attrs.rel) return {};
          return { rel: attrs.rel };
        },
      },
    };
  },

  renderHTML({ HTMLAttributes }) {
    return ['a', HTMLAttributes, 0];
  },
});
