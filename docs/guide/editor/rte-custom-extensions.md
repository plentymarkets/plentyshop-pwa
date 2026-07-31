# Custom Rich Text Editor Extensions

The rich text editor (RTE) used in the page editor is powered by [Tiptap](https://tiptap.dev/). This guide explains how theme developers can add custom Tiptap extensions — such as new inline nodes — and wire them into both the editor instance and the admin panel toolbar.

## Background

Tiptap is built on top of [ProseMirror](https://prosemirror.net/) and models document content as a tree of **nodes** and **marks**. Extensions add new node types, marks, or editor commands without modifying core editor code.

The shop registers extensions inside the `useRichTextEditor` composable located at:

```
apps/web/app/composables/useRichTextEditor/
```

Custom extensions live in the `helpers/` subdirectory of that composable and are imported and passed to the Tiptap `useEditor` call.

## Extension types

| Type          | Purpose                                                               | Tiptap docs                                                                                     |
| ------------- | --------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| **Node**      | Block or inline content element (e.g. an icon, a callout box)         | [Nodes](https://tiptap.dev/docs/editor/extensions/custom-extensions/create-new#nodes)           |
| **Mark**      | Formatting applied to text (e.g. highlight colour, custom link)       | [Marks](https://tiptap.dev/docs/editor/extensions/custom-extensions/create-new#marks)           |
| **Extension** | Behaviour without a document representation (e.g. keyboard shortcuts) | [Extensions](https://tiptap.dev/docs/editor/extensions/custom-extensions/create-new#extensions) |

This guide focuses on **nodes** because they are the most common extension type needed when adding new content types.

## Example: `IconNode`

The built-in `IconNode` (`helpers/iconExtension.ts`) is a minimal, real-world example of an **inline atomic node** — a self-contained element that sits inside a paragraph and renders an SVG icon.

### Helper functions

The extension uses two private helpers to build the DOM element both in the live editor view and in the serialised HTML output.

```typescript
import { Node, mergeAttributes } from '@tiptap/core';
import { userIcons } from '~/components/editor/RichTextEditor/utils/icons';
import type { DOMOutputSpec } from '@tiptap/pm/model';

// Builds an SVG string from the icon registry, or null if the icon is unknown.
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

// Creates the <span> wrapper with the SVG inlined.
// Falls back to an `rte-icon--missing` class when the icon name is unknown.
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
```

The `userIcons` registry is a plain object keyed by icon name. Each entry contains a `viewBox` string, a `paths` array of SVG path `d` values, and a human-readable `label`.

### Node definition

```typescript
declare module '@tiptap/core' {
  // eslint-disable-next-line custom-rules/file-organization-types
  interface Commands<ReturnType> {
    icon: {
      insertIcon: (name: string) => ReturnType;
    };
  }
}

export const IconNode = Node.create({
  name: 'icon', // unique schema name

  group: 'inline', // participates in inline content groups
  inline: true, // renders inline, not as a block
  atom: true, // treated as a single unit — not editable inside
  selectable: true,
  draggable: false,
  marks: '_', // allows all marks on this node

  // 1. Persistent attributes stored in the document
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

  // 2. How to read this node from HTML
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

  // 3. How to serialise this node back to HTML
  renderHTML({ node, HTMLAttributes }) {
    const span = buildIconElement(node.attrs.name as string | null, HTMLAttributes);
    return span as unknown as DOMOutputSpec;
  },

  // 4. Live DOM element shown inside the editor
  addNodeView() {
    return ({ node }) => {
      const dom = buildIconElement(node.attrs.name as string | null);
      return { dom };
    };
  },

  // 5. Chainable editor command
  addCommands() {
    return {
      insertIcon:
        (name: string) =>
        ({ chain }) =>
          chain().focus().insertContent({ type: this.name, attrs: { name } }).run(),
    };
  },
});
```

### Key concepts

| Hook            | Purpose                                                                               | Tiptap docs                                                                                                    |
| --------------- | ------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `addAttributes` | Declares persistent data stored per node                                              | [Attributes](https://tiptap.dev/docs/editor/extensions/custom-extensions/extend-existing#attributes)           |
| `parseHTML`     | CSS-selector rules that map existing HTML to this node on paste or load               | [parseHTML](https://tiptap.dev/docs/editor/extensions/custom-extensions/create-new/node#parsehtml)             |
| `renderHTML`    | Returns the DOM structure written when serialising to HTML                            | [renderHTML](https://tiptap.dev/docs/editor/extensions/custom-extensions/create-new/node#renderhtml)           |
| `addNodeView`   | Returns a live DOM element rendered in the editor canvas                              | [Node Views](https://tiptap.dev/docs/editor/extensions/custom-extensions/create-new/node#addnodeview-advanced) |
| `addCommands`   | Registers chainable commands callable as `editor.chain().focus().insertIcon(…).run()` | [Commands](https://tiptap.dev/docs/editor/extensions/custom-extensions/create-new/extension#addcommands)       |

`renderHTML` and `addNodeView` serve different purposes: `renderHTML` controls the **saved HTML** output, while `addNodeView` controls the **live editor canvas** rendering. When both are defined, `addNodeView` takes precedence in the editor and `renderHTML` is used during HTML serialisation.

## TypeScript: declaring commands

Augment the Tiptap `Commands` interface to keep command calls type-safe. By convention the interface key matches the `name` given in `Node.create({ name: '...' })`:

```typescript
declare module '@tiptap/core' {
  // eslint-disable-next-line custom-rules/file-organization-types
  interface Commands<ReturnType> {
    myNode: {
      // matches Node.create({ name: 'myNode' })
      myCommand: (arg: string) => ReturnType;
    };
  }
}
```

This pattern is [documented by Tiptap](https://tiptap.dev/docs/editor/extensions/custom-extensions/create-new#typescript) and required for every custom command.

## Step 1 — Create the extension file

Create a new file inside the helpers directory:

```
apps/web/app/composables/useRichTextEditor/helpers/myExtension.ts
```

Export a single named constant that is the result of `Node.create({...})`, `Mark.create({...})`, or `Extension.create({...})`.

## Step 2 — Register the extension

Open `useRichTextEditor.ts` and import your extension, then add it to the `extensions` array inside the existing `useEditor` call. Also expose any command helpers you want to make available to toolbar components via the composable's return value:

```typescript
// apps/web/app/composables/useRichTextEditor/useRichTextEditor.ts
import { MyExtension } from './helpers/myExtension';

export function useRichTextEditor(args: UseRichTextEditorArgs) {
  // ...
  const editor = useEditor({
    extensions: [
      StarterKit,
      // ...other existing extensions
      MyExtension,
    ],
    // ...
  });

  // Wrap the Tiptap command in a plain function so toolbar components
  // don't need to access the editor instance directly.
  const insertMyContent = (value: string) => {
    editor.value?.chain().focus().myCommand(value).run();
  };

  return {
    // ...other existing return values
    insertMyContent,
  };
}
```

> The order of extensions matters when two extensions define overlapping `parseHTML` rules. Place more specific extensions before broader ones.

## Step 3 — Integrate with the admin toolbar

### 3a — Add a toolbar icon

Register a new entry in the `icons` record inside:

```
apps/web/app/components/editor/RichTextEditor/utils/icons.ts
```

Each entry is either a single Material Symbols path string (for icons that fit the `0 -960 960 960` viewBox) or a `{ paths, viewBox }` object for icons with custom viewBoxes:

The `Icon` type supports three forms — pick whichever matches your SVG source:

```typescript
// icons.ts

// Option A — single path, default viewBox "0 -960 960 960":
myFeature: 'M…path data…',

// Option B — multiple paths, default viewBox:
myFeature: ['M…path 1…', 'M…path 2…'],

// Option C — multiple paths with a custom viewBox:
myFeature: {
  paths: ['M…path 1…', 'M…path 2…'],
  viewBox: '0 0 48 48',
},
```

The key you choose here is the `icon-name` value you will use in the next step.

### 3b — Add the button to a toolbar component

Open either `RichTextEditorBasicButtons.vue` (for core formatting actions) or `RichTextEditorExtendedButtons.vue` (for secondary/extended actions) and:

1. Add your command function as a new prop.
2. Render an `EditorRichTextEditorMenuButton` that calls it.

```vue
<!-- RichTextEditorExtendedButtons.vue (excerpt) -->
<template>
  <!-- ...existing buttons... -->
  <EditorRichTextEditorMenuButton
    :active="isActive('myNode')"
    icon-name="myFeature"
    @click="insertMyContent('someValue')"
  />
</template>

<script setup lang="ts">
defineProps<{
  // ...existing props...
  isActive: (name: string) => boolean;
  insertMyContent: (value: string) => void;
}>();
</script>
```

`EditorRichTextEditorMenuButton` accepts `icon-name` (matching the key added in `icons.ts`) and `active` as declared props. The `active` boolean drives the pressed/highlighted state. Any other HTML button attributes — such as `disabled` — are passed through to the underlying `<button>` element via Vue's [fallthrough attribute](https://vuejs.org/guide/components/attrs) inheritance. See [Tiptap – isActive](https://tiptap.dev/docs/editor/api/editor#isactive) for details on the `isActive` helper.

### 3c — Pass the command from `RichTextEditor.vue`

`RichTextEditor.vue` is the parent that calls `useRichTextEditor` and passes helpers down as props. Destructure your new command and forward it to the toolbar component:

```typescript
// RichTextEditor.vue — <script setup>
const {
  // ...existing destructured values...
  insertMyContent,
} = useRichTextEditor(args);
```

Then forward it to the toolbar component in the template:

```vue
<!-- RichTextEditor.vue — <template> (excerpt) -->
<EditorRichTextEditorExtendedButtons :cmd="cmd" :is-active="isActive" :insert-my-content="insertMyContent" />
```

## Full data flow

```
helpers/myExtension.ts
        │
        ▼
useRichTextEditor.ts  ──  useEditor({ extensions: [..., MyExtension] })
        │                 exposes insertMyContent() in return value
        ▼
RichTextEditor.vue  ──  passes insertMyContent as prop
        │
        ▼
RichTextEditorBasicButtons.vue
  or RichTextEditorExtendedButtons.vue
        │  EditorRichTextEditorMenuButton (icon-name from icons.ts)
        │  calls insertMyContent() on click
        │
        ▼
editor.chain().focus().myCommand().run()
        │
        ▼
renderHTML / addNodeView produces DOM output
        │
        ▼
Saved as HTML string in block content
```

## Reference

| Resource                           | URL                                                                         |
| ---------------------------------- | --------------------------------------------------------------------------- |
| Tiptap – Create new extension      | https://tiptap.dev/docs/editor/extensions/custom-extensions/create-new      |
| Tiptap – Extend existing extension | https://tiptap.dev/docs/editor/extensions/custom-extensions/extend-existing |
| Tiptap – Node Views                | https://tiptap.dev/docs/editor/extensions/custom-extensions/node-views      |
| Tiptap – Nodes reference           | https://tiptap.dev/docs/editor/extensions/nodes                             |
| Tiptap – Commands API              | https://tiptap.dev/docs/editor/api/commands                                 |
| Tiptap – isActive                  | https://tiptap.dev/docs/editor/api/editor#isactive                          |
| ProseMirror – Node types           | https://prosemirror.net/docs/guide/#schema                                  |
