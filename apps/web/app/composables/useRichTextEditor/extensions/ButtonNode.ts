import { Node, mergeAttributes } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import ButtonNodeView from './ButtonNodeView.vue'

export const ButtonNode = Node.create({
  name: 'uiButton',
  group: 'block',
  atom: true,
  selectable: true,
  draggable: true,

  addAttributes() {
    return {
      label: {
        default: 'Click me',
      },
      to: {
        default: '/',
      },
      variant: {
        default: 'primary',
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'ui-button',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['ui-button', mergeAttributes(HTMLAttributes)]
  },

  addNodeView() {
    return VueNodeViewRenderer(ButtonNodeView as any)
  },
})
