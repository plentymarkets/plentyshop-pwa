<template>
  <div class="site-settings-view sticky top-[52px]">
    <header class="flex items-center justify-between px-4 py-5 border-b">
      <div class="flex items-center text-xl font-bold">Settings</div>
      <UiButton square variant="tertiary" size="sm" class="!p-0" @click="drawerOpen = false">
        <SfIconClose />
      </UiButton>
    </header>

    <UiAccordionItem
      v-model="fontsOpen"
      summary-active-class="bg-neutral-100 border-t-0"
      summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between items-center select-none border-b"
    >
      <template #summary>
        <h2>Fonts</h2>
      </template>

      <div class="flex justify-between mb-2">
        <UiFormLabel>Global fonts</UiFormLabel>
        <SfTooltip
          label="The shop supports Google Fonts. Fonts are downloaded during the build process. This means the shop does not connect to Google while the shop is running."
          :placement="'top'"
          :show-arrow="true"
          class="ml-2 z-10"
        >
          <SfIconInfo :size="'sm'" />
        </SfTooltip>
      </div>

      <Multiselect
        v-model="selectedFont"
        :options="fonts"
        placeholder="Select a font"
        label="value"
        track-by="caption"
        :allow-empty="false"
        class="cursor-pointer"
        select-label=""
        deselect-label="Selected"
        @select="loadGoogleFont(selectedFont.value)"
      />
      <span class="typography-text-xs text-neutral-700">Choose one Google font for all texts</span>
    </UiAccordionItem>

    <UiAccordionItem
      v-model="colorsOpen"
      summary-active-class="bg-neutral-100"
      summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between items-center select-none border-b"
    >
      <template #summary>
        <h2 class="">Colors</h2>
      </template>
      <div class="py-2">
        <div class="flex justify-between mb-2">
          <UiFormLabel>Primary color</UiFormLabel>
          <SfTooltip
            label="The shop uses a primary and secondary color palette. Each palette consists of ten shades. The colors configured here serve as the base value for the respective palette. All other shades are automatically generated during the build process."
            :placement="'top'"
            :show-arrow="true"
            class="ml-2 z-10"
          >
            <SfIconInfo :size="'sm'" />
          </SfTooltip>
        </div>
        <label>
          <SfInput v-model="primaryColor" type="text">
            <template #suffix>
              <label for="primary-color" :style="{ backgroundColor: primaryColor }" class="rounded-lg cursor-pointer">
                <input id="primary-color" v-model="primaryColor" type="color" class="invisible w-8" />
              </label>
            </template>
          </SfInput>
          <span class="typography-text-xs text-neutral-700">Choose primary color</span>
        </label>
      </div>
      <div class="py-2">
        <div class="flex justify-between mb-2">
          <UiFormLabel>Secondary color</UiFormLabel>
          <SfTooltip
            label="The shop uses a primary and secondary color palette. Each palette consists of ten shades. The colors configured here serve as the base value for the respective palette. All other shades are automatically generated during the build process."
            :placement="'top'"
            :show-arrow="true"
            class="ml-2 z-10"
          >
            <SfIconInfo :size="'sm'" />
          </SfTooltip>
        </div>
        <label>
          <SfInput v-model="secondaryColor" type="text">
            <template #suffix>
              <label
                for="secondary-color"
                :style="{ backgroundColor: secondaryColor }"
                class="rounded-lg cursor-pointer"
              >
                <input id="secondary-color" v-model="secondaryColor" type="color" class="invisible w-8" />
              </label>
            </template>
          </SfInput>
          <span class="typography-text-xs text-neutral-700">Choose secondary color</span>
        </label>
      </div>
    </UiAccordionItem>

    <UiAccordionItem
      v-model="blocksSpacingOpen"
      summary-active-class="bg-neutral-100"
      summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between items-center select-none border-b"
    >
      <template #summary>
        <h2 class="">Blocks spacing</h2>
      </template>
      <div class="border-b py-1">
        <UiButton
          v-for="(blocksSpacingSize, key) in blocksSpacingSizes"
          :key="key"
          type="button"
          :variant="blocksSpacingSize === blockSize ? 'primary' : 'tertiary'"
          class="!hover:bg-gray-100 uppercase"
          @click="updateBlockSize(blocksSpacingSize)"
        >
          {{ blocksSpacingSize }}
        </UiButton>
      </div>
      <div class="px-4 py-3">
        <span class="typography-text-xs text-neutral-700">Spacing between blocks: {{ spacingInPx }}px</span>
      </div>
    </UiAccordionItem>
  </div>
</template>

<script setup lang="ts">
import Multiselect from 'vue-multiselect';
import 'vue-multiselect/dist/vue-multiselect.min.css';
import { SfIconClose, SfIconInfo, SfInput, SfTooltip } from '@storefront-ui/vue';
import fonts from '~/fonts/meta.json';
import { _s, _m, _l, _xl } from '#tailwind-config/theme/spacing';

const { drawerOpen, loadGoogleFont, primaryColor, secondaryColor, updateBlockSize, blockSize, selectedFont } =
  useSiteConfiguration();

const fontsOpen = ref(false);
const colorsOpen = ref(false);
const blocksSpacingOpen = ref(false);

const blocksSpacingSizes = ref(['s', 'm', 'l', 'xl']);

const spacingInPx = computed(() => {
  if (!blockSize.value) return '0';

  const sizeMap: Record<string, string> = {
    s: _s,
    m: _m,
    l: _l,
    xl: _xl,
  };

  const remValue = parseFloat(sizeMap[blockSize.value]);
  return remValue * 16;
});
</script>
