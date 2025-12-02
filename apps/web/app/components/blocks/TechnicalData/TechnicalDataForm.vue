<template>
  <div>
    <UiAccordionItem
      v-model="textSettings"
      summary-active-class="bg-neutral-100 border-t-0"
      summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between items-center select-none border-b"
      data-testid="technical-data-settings"
    >
      <template #summary>
        <h2>{{ getEditorTranslation('text-settings-label') }}</h2>
      </template>

      <div class="py-2">
        <div class="flex justify-between mb-2">
          <UiFormLabel>{{ getEditorTranslation('main-title-label') }}</UiFormLabel>
        </div>
        <label>
          <SfInput v-model="itemTextBlock.text.title" type="text" data-testid="input-main-title">
            <template #suffix>
              <label for="text-title" class="rounded-lg cursor-pointer">
                <input id="text-title" v-model="itemTextBlock.text.title" type="text" class="invisible w-8" />
              </label>
            </template>
          </SfInput>
        </label>
      </div>
    </UiAccordionItem>

    <UiAccordionItem
      v-model="layoutSettings"
      summary-active-class="bg-neutral-100 border-t-0"
      summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between items-center select-none border-b"
      data-testid="technical-data-layout"
    >
      <template #summary>
        <h2>{{ getEditorTranslation('layout-settings-label') }}</h2>
      </template>

      <div class="flex justify-between my-5">
        <span>{{ getEditorTranslation('display-as-collapsable') }}</span>
        <span>
          <SfSwitch v-model="isCollapsible" data-testid="technical-data-displayAsCollapsable-switch" />
        </span>
      </div>

      <div class="flex justify-between">
        <span>{{ getEditorTranslation('initially-collapsed') }}</span>
        <span>
          <SfSwitch
            v-model="isInitiallyCollapsed"
            :disabled="!isCollapsible"
            data-testid="technical-data-initiallyCollapsed-switch"
          />
        </span>
      </div>
      <EditorFullWidthToggle v-model="isFullWidth" :block-uuid="props.uuid || blockUuid" />
      <div class="mt-5">
        {{ getEditorTranslation('padding') }}
      </div>
      <div>
        <div class="grid grid-cols-4 gap-px rounded-md overflow-hidden border border-gray-300">
          <div class="flex items-center justify-center gap-1 px-2 py-1 bg-white border-r">
            <span><SfIconArrowUpward /></span>
            <input
              v-model.number="itemTextBlock.layout.paddingTop"
              type="number"
              class="w-12 text-center outline-none"
              data-testid="padding-top"
            />
          </div>

          <div class="flex items-center justify-center gap-1 px-2 py-1 bg-white border-r">
            <span><SfIconArrowDownward /></span>
            <input
              v-model.number="itemTextBlock.layout.paddingBottom"
              type="number"
              class="w-12 text-center outline-none"
              data-testid="padding-bottom"
            />
          </div>
          <div class="flex items-center justify-center gap-1 px-2 py-1 bg-white border-r">
            <span><SfIconArrowBack /></span>
            <input
              v-model.number="itemTextBlock.layout.paddingLeft"
              type="number"
              class="w-12 text-center outline-none"
              data-testid="padding-left"
            />
          </div>
          <div class="flex items-center justify-center gap-1 px-2 py-1 bg-white">
            <span><SfIconArrowForward /></span>
            <input
              v-model.number="itemTextBlock.layout.paddingRight"
              type="number"
              class="w-12 text-center outline-none"
              data-testid="padding-right"
            />
          </div>
        </div>
      </div>
    </UiAccordionItem>
  </div>
</template>

<script setup lang="ts">
import {
  SfInput,
  SfSwitch,
  SfIconArrowUpward,
  SfIconArrowDownward,
  SfIconArrowBack,
  SfIconArrowForward,
} from '@storefront-ui/vue';
import type { TechnicalDataFormProps, TechnicalDataContent } from './types';

const route = useRoute();
const { data } = useCategoryTemplate(
  route?.meta?.identifier as string,
  route.meta.type as string,
  useNuxtApp().$i18n.locale.value,
);

const { blockUuid } = useSiteConfiguration();
const { findOrDeleteBlockByUuid } = useBlockManager();

const props = defineProps<TechnicalDataFormProps>();

const itemTextBlock = computed<TechnicalDataContent>(() => {
  const rawContent = findOrDeleteBlockByUuid(data.value, props.uuid || blockUuid.value)?.content ?? {};
  const content = rawContent as Partial<TechnicalDataContent>;
  if (!content.text) {
    content.text = { title: '' };
  }
  return content as TechnicalDataContent;
});

const { isFullWidth } = useFullWidthToggle(computed(() => itemTextBlock.value.layout ?? { fullWidth: false }));
const textSettings = ref(false);
const layoutSettings = ref(false);
watch(
  () => itemTextBlock.value.layout.displayAsCollapsable,
  (newValue) => {
    if (!newValue) itemTextBlock.value.layout.initiallyCollapsed = false;
  },
);

const isCollapsibleInit = itemTextBlock.value.layout.displayAsCollapsable;
const isCollapsible = ref(isCollapsibleInit);

const isInitiallyCollapsedInit = itemTextBlock.value.layout.initiallyCollapsed;
const isInitiallyCollapsed = ref(isInitiallyCollapsedInit);

watch(isCollapsible, (newValue) => {
  itemTextBlock.value.layout.displayAsCollapsable = newValue;
  if (!newValue) {
    isInitiallyCollapsed.value = false;
    itemTextBlock.value.layout.initiallyCollapsed = false;
  }
});

watch(isInitiallyCollapsed, (newValue) => {
  itemTextBlock.value.layout.initiallyCollapsed = newValue;
});
</script>

<i18n lang="json">
{
  "en": {
    "text-settings-label": "Text",
    "main-title-label": "Title",
    "layout-settings-label": "Layout Settings",
    "display-as-collapsable": "Display as Collapsable",
    "initially-collapsed": "Initially Collapsed",
    "padding": "Padding"
  },
  "de": {
    "text-settings-label": "Text",
    "main-title-label": "Title",
    "display-as-collapsable": "Display as Collapsable",
    "layout-settings-label": "Layout Settings",
    "initially-collapsed": "Initially Collapsed",
    "padding": "Padding"
  }
}
</i18n>
