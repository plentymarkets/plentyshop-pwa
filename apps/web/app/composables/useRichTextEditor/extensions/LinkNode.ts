import { Node, mergeAttributes } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import LinkNodeView from './LinkNodeView.vue'

export const LinkNode = Node.create({
  name: 'customLink',
  group: 'inline',
  inline: true,
  atom: true,
  selectable: true,

  addAttributes() {
    return {
      href: {
        default: '',
      },
      target: {
        default: '_self',
      },
      rel: {
        default: '',
      },
      label: {
        default: 'Link',
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'app-link',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['app-link', mergeAttributes(HTMLAttributes)]
  },

  addNodeView() {
    return VueNodeViewRenderer(LinkNodeView as any)
  },
})
