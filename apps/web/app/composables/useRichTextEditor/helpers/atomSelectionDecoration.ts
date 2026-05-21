import { Extension } from '@tiptap/core';
import { NodeSelection, Plugin, PluginKey } from '@tiptap/pm/state';
import { Decoration, DecorationSet } from '@tiptap/pm/view';

const decorationKey = new PluginKey('atomInSelection');

export const AtomSelectionDecoration = Extension.create({
  name: 'atomSelectionDecoration',

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: decorationKey,
        props: {
          decorations(state) {
            const { selection, doc } = state;
            if (selection instanceof NodeSelection || selection.empty) return DecorationSet.empty;
            const { from, to } = selection;
            const decorations: Decoration[] = [];
            doc.nodesBetween(from, to, (node, pos) => {
              if (node.isAtom && node.isInline) {
                decorations.push(Decoration.node(pos, pos + node.nodeSize, { class: 'rte-atom-selected' }));
              }
            });
            return DecorationSet.create(doc, decorations);
          },
        },
      }),
    ];
  },
});
