<template>
  <div class="rte__toolbar" data-testid="rte-toolbar">
    <!-- Font size -->
    <select
      class="rte__select"
      :value="currentBlockType"
      data-testid="rte-font-size"
      @mousedown.stop
      @click.stop
      @change="onFontSizeChange(($event.target as HTMLSelectElement).value)"
    >
      <option value="paragraph">Normal</option>
      <option value="h1">H1</option>
      <option value="h2">H2</option>
      <option value="h3">H3</option>
    </select>

    <!-- Font color -->
    <label class="rte__color-wrap" @mousedown.stop @click.stop>
      <span class="sr-only">Font color</span>
      <input
        type="color"
        class="rte__color"
        data-testid="rte-font-color"
        :value="textColor"
        @input="setFontColor(($event.target as HTMLInputElement).value)"
      />
    </label>

    <button
      type="button"
      class="rte__btn"
      :class="{ active: isActive('bold') }"
      @mousedown.prevent
      @click="cmd('toggleBold')"
    >
      <b>B</b>
    </button>

    <button
      type="button"
      class="rte__btn"
      :class="{ active: isActive('italic') }"
      @mousedown.prevent
      @click="cmd('toggleItalic')"
    >
      <i>I</i>
    </button>

    <button
      type="button"
      class="rte__btn"
      :class="{ active: isActive('underline') }"
      @mousedown.prevent
      @click="cmd('toggleUnderline')"
    >
      <span style="text-decoration: underline">U</span>
    </button>

    <button type="button" class="rte__btn" :class="{ active: isActive('link') }" @mousedown.prevent @click="toggleLink">
      🔗
    </button>

    <button
      v-if="expandable"
      type="button"
      class="rte__btn ml-auto"
      :aria-expanded="expandedLocal"
      data-testid="rte-expand"
      @mousedown.prevent
      @click="expandedLocal = !expandedLocal"
    >
      <span class="chev" :class="{ up: expandedLocal }">▾</span>
    </button>
  </div>

  <!-- Expanded toolbar -->
  <div
    v-if="expandable && expandedLocal"
    class="rte__toolbar rte__toolbar--expanded"
    data-testid="rte-toolbar-expanded"
  >
    <button
      type="button"
      class="rte__btn"
      :class="{ active: isActive('blockquote') }"
      @mousedown.prevent
      @click="cmd('toggleBlockquote')"
    >
      ❝
    </button>

    <button
      type="button"
      class="rte__btn"
      :class="{ active: isActive('strike') }"
      @mousedown.prevent
      @click="cmd('toggleStrike')"
    >
      S
    </button>

    <label class="rte__color-wrap" @mousedown.stop @click.stop>
      <span class="sr-only">Highlight color</span>
      <input
        type="color"
        class="rte__color"
        data-testid="rte-highlight-color"
        :value="highlightColor"
        @input="setHighlightColor(($event.target as HTMLInputElement).value)"
      />
    </label>

    <span class="rte__split" />

    <button
      type="button"
      class="rte__btn"
      :class="{ active: isActiveAlign('left') }"
      @mousedown.prevent
      @click="setAlign('left')"
    >
      ⬅
    </button>
    <button
      type="button"
      class="rte__btn"
      :class="{ active: isActiveAlign('center') }"
      @mousedown.prevent
      @click="setAlign('center')"
    >
      ⬌
    </button>
    <button
      type="button"
      class="rte__btn"
      :class="{ active: isActiveAlign('right') }"
      @mousedown.prevent
      @click="setAlign('right')"
    >
      ➡
    </button>
    <button
      type="button"
      class="rte__btn"
      :class="{ active: isActiveAlign('justify') }"
      @mousedown.prevent
      @click="setAlign('justify')"
    >
      ☰
    </button>

    <span class="rte__split" />

    <button
      type="button"
      class="rte__btn"
      :class="{ active: isActive('bulletList') }"
      @mousedown.prevent
      @click="cmd('toggleBulletList')"
    >
      ••
    </button>
    <button
      type="button"
      class="rte__btn"
      :class="{ active: isActive('orderedList') }"
      @mousedown.prevent
      @click="cmd('toggleOrderedList')"
    >
      1.
    </button>
    <button type="button" class="rte__btn" @mousedown.prevent @click="cmd('setHorizontalRule')">─</button>

    <span class="rte__split" />

    <button type="button" class="rte__btn" :disabled="!canUndo" @mousedown.prevent @click="undo">↶</button>
    <button type="button" class="rte__btn" :disabled="!canRedo" @mousedown.prevent @click="redo">↷</button>

    <button type="button" class="rte__btn ml-auto" @mousedown.prevent @click="clearFormatting">⌫</button>
  </div>

  <!-- Editor -->
  <div class="rte__body" data-testid="rte-editor" @mousedown="editor?.chain().focus().run()">
    <EditorContent :editor="editor" class="rte__content rte-prose" :style="editorStyle" />
  </div>
</template>

<script setup lang="ts">
import { EditorContent } from '@tiptap/vue-3';
import { useRichTextEditor, type RteAlign } from '~/composables/useRichTextEditor';

const props = withDefaults(
  defineProps<{
    modelValue?: string;
    minHeight?: number;
    expandable?: boolean;
    expanded?: boolean;
    textAlign?: RteAlign;
  }>(),
  {
    modelValue: '',
    minHeight: 120,
    expandable: true,
    expanded: false,
    textAlign: 'left',
  },
);

const emit = defineEmits<{
  (e: 'update:modelValue', v: string): void;
  (e: 'update:expanded', v: boolean): void;
}>();

const {
  editor,
  expandedLocal,

  cmd,
  isActive,

  currentBlockType,
  onFontSizeChange,

  textColor,
  highlightColor,
  setFontColor,
  setHighlightColor,

  setAlign,
  isActiveAlign,
  textAlignStyle,

  canUndo,
  canRedo,
  undo,
  redo,

  toggleLink,
  clearFormatting,
  focus,
} = useRichTextEditor({
  modelValue: toRef(props, 'modelValue'),
  onUpdateModelValue: (v) => emit('update:modelValue', v),

  expanded: toRef(props, 'expanded'),
  onUpdateExpanded: (v) => emit('update:expanded', v),

  textAlign: toRef(props, 'textAlign'),
});

defineExpose({ editor, focus, clearFormatting, undo, redo });

const editorStyle = computed(() => ({
  minHeight: `${props.minHeight}px`,
  ...textAlignStyle.value,
}));
</script>
<style scoped>
.rte__toolbar {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px;
  background: #f8f9fa;
  border-bottom: 1px solid #dee2e6;
}

.rte__select {
  height: 32px;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  padding: 0 8px;
  background: white;
  font-size: 13px;
}

.rte__color-wrap {
  display: inline-flex;
  align-items: center;
}

.rte__color {
  width: 38px;
  height: 32px;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  background: white;
  padding: 2px;
  cursor: pointer;
}

.rte__btn {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  border: 1px solid transparent;
  background: transparent;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  cursor: pointer;
}

.rte__btn:hover {
  background: #e9ecef;
}

.rte__btn.active {
  background: #dee2e6;
  border-color: #ced4da;
}

.rte__btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.rte__body {
  padding: 8px 10px;
}

.ml-auto {
  margin-left: auto;
}

.rte__split {
  width: 1px;
  height: 22px;
  background: #dee2e6;
  margin: 0 2px;
}

.chev {
  display: inline-block;
  transition: transform 150ms ease;
}

.chev.up {
  transform: rotate(180deg);
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
</style>
