<template>
  <div data-testid="footer-settings-drawer" class="block-footer-edit sticky h-[80vh] overflow-y-auto">
    <div v-if="!editingBlock" class="space-y-0">
      <EditorGridElementsPanel
        v-model="elementsOpen"
        :uuid="footerUuid"
        :min-items="1"
        :quick-add-options="footerQuickAddOptions"
        @edit-element="editElement"
      />

      <EditorFormPanel
        v-model="colorsOpen"
        :title="getEditorTranslation('colors-group-label')"
        data-testid="color-column-section"
      >
        <div class="py-2">
          <div class="flex justify-between mb-2">
            <UiFormLabel>{{ getEditorTranslation('colors-background-label') }}</UiFormLabel>
          </div>
          <EditorColorPicker v-model="backgroundColor" class="w-full">
            <template #trigger="{ color, toggle }">
              <label>
                <SfInput v-model="backgroundColor" type="text" data-testid="footer-bg-color-select">
                  <template #suffix>
                    <button
                      type="button"
                      class="border border-[#a0a0a0] rounded-lg cursor-pointer w-10 h-8"
                      :style="{ backgroundColor: color }"
                      @mousedown.stop
                      @click.stop="toggle"
                    />
                  </template>
                </SfInput>
              </label>
            </template>
          </EditorColorPicker>
        </div>

        <div class="py-2">
          <div class="flex justify-between mb-2">
            <UiFormLabel>{{ getEditorTranslation('colors-text-label') }}</UiFormLabel>
          </div>
          <EditorColorPicker v-model="textColor" class="w-full">
            <template #trigger="{ color, toggle }">
              <label>
                <SfInput v-model="textColor" type="text" data-testid="footer-text-color-select">
                  <template #suffix>
                    <button
                      type="button"
                      class="border border-[#a0a0a0] rounded-lg cursor-pointer w-10 h-8"
                      :style="{ backgroundColor: color }"
                      @mousedown.stop
                      @click.stop="toggle"
                    />
                  </template>
                </SfInput>
              </label>
            </template>
          </EditorColorPicker>
        </div>
      </EditorFormPanel>
    </div>

    <div v-else class="space-y-0">
      <component :is="blockForm" :uuid="editingBlock.meta.uuid" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { SfInput } from '@storefront-ui/vue';
import type { FooterContainerBlock } from '~/components/blocks/structure/FooterContainer/types';
import type { Block } from '@plentymarkets/shop-api';

const { footer } = useBlocks();

const elementsOpen = ref(true);
const colorsOpen = ref(true);

const footerContainer = computed(() => (footer.value ?? {}) as FooterContainerBlock);
const footerUuid = computed(() => footerContainer.value.meta?.uuid);
const { editingBlock, blockForm } = useNestedBlockForm(footerUuid);
const { pushEdit } = useBlockEditStack();

const backgroundColor = computed({
  get: () => footerContainer.value.configuration?.colors?.background ?? '',
  set: (value: string) => {
    if (!footerContainer.value.configuration) {
      footerContainer.value.configuration = { visible: true };
    }
    if (!footerContainer.value.configuration.colors) {
      footerContainer.value.configuration.colors = { background: '', text: '' };
    }
    footerContainer.value.configuration.colors.background = value;
  },
});

const textColor = computed({
  get: () => footerContainer.value.configuration?.colors?.text ?? '',
  set: (value: string) => {
    if (!footerContainer.value.configuration) {
      footerContainer.value.configuration = { visible: true };
    }
    if (!footerContainer.value.configuration.colors) {
      footerContainer.value.configuration.colors = { background: '', text: '' };
    }
    footerContainer.value.configuration.colors.text = value;
  },
});

const editElement = (block: Block) => {
  pushEdit(block);
};
</script>

<i18n lang="json">
{
  "en": {
    "colors-group-label": "Colour",
    "colors-background-label": "Background colour",
    "colors-text-label": "Text colour"
  },
  "de": {
    "colors-group-label": "Colour",
    "colors-background-label": "Background colour",
    "colors-text-label": "Text colour"
  }
}
</i18n>
