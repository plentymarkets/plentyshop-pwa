<template>
  <div class="rounded-md border bg-white shadow-md p-3 min-w-[220px]">
    <EditorColorPickerTabs :active-tab="props.activeTab" @update:active-tab="emit('update:activeTab', $event)" />

    <div v-if="props.activeTab === 'picker'">
      <color-picker-block
        :model-value="props.modelValue"
        with-hex-input
        with-rgb-input
        with-alpha
        with-initial-color
        with-eye-dropper
        with-colors-history
        @update:model-value="emit('update:modelValue', $event)"
      />
    </div>
    <div v-else>
      <div class="flex gap-2">
        <button
          type="button"
          class="h-8 w-8 rounded-md border border-slate-200"
          :style="{ backgroundColor: props.primaryColor || '#000000' }"
          @click="emit('update:modelValue', 'rgb(var(--colors-2-primary-500))')"
        />
        <button
          type="button"
          class="h-8 w-8 rounded-md border border-slate-200"
          :style="{ backgroundColor: props.secondaryColor || '#000000' }"
          @click="emit('update:modelValue', 'rgb(var(--colors-2-secondary-500))')"
        />
      </div>
      <div class="mt-3">
        <span class="italic text-xs">{{ getEditorTranslation('primary-shop') }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: string | undefined;
  activeTab: 'shop' | 'picker';
  primaryColor: string | null;
  secondaryColor: string | null;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', v: string): void;
  (e: 'update:activeTab', v: 'shop' | 'picker'): void;
}>();
</script>

<i18n lang="json">
{
  "en": {
    "primary-shop": "These are your primary shop colors. You can customize them in your site settings from Branding & Design"
  },
  "de": {
    "primary-shop": "These are your primary shop colors. You can customize them in your site settings from Branding & Design"
  }
}
</i18n>
