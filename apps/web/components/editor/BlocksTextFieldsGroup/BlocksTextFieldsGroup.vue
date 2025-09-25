<template>
  <div class="space-y-6">
    <div v-if="model.pretitle !== undefined">
      <UiFormLabel class="mb-1">{{ pretitleLabel }}</UiFormLabel>
      <SfInput
        v-model="model.pretitle"
        name="preTitle"
        type="text"
        :placeholder="pretitlePlaceholder"
        :data-testid="pretitleTestid"
      />
    </div>

    <div v-if="model.title !== undefined">
      <UiFormLabel class="mb-1">{{ titleLabel }}</UiFormLabel>
      <SfInput
        v-model="model.title"
        name="mainTitle"
        type="text"
        :placeholder="titlePlaceholder"
        :data-testid="titleTestid"
      />
    </div>
    <div v-if="model.subtitle !== undefined">
      <UiFormLabel class="mb-1">{{ subtitleLabel }}</UiFormLabel>
      <SfInput
        v-model="model.subtitle"
        name="subtitle"
        type="text"
        :placeholder="subtitlePlaceholder"
        :data-testid="subtitleTestid"
      />
    </div>
    textAlignLabel, textAlignLeftLabel, textAlignCenterLabel, textAlignRightLabel,
    <div v-if="model.htmlDescription !== undefined">
      <UiFormLabel class="mb-1">{{ descriptionLabel }}</UiFormLabel>
      <SfTextarea
        v-model="model.htmlDescription"
        name="description"
        :placeholder="descriptionPlaceholder"
        :data-testid="descriptionTestid"
        class="w-full min-h-[232px]"
      />
    </div>
    <div v-if="model.color !== undefined">
      <UiFormLabel class="mb-1">{{ colorLabel }}</UiFormLabel>
      <SfInput v-model="model.color" type="text" :data-testid="colorTestid">
        <template #suffix>
          <label
            for="text-color"
            :style="{ backgroundColor: model.color }"
            class="border border-[#a0a0a0] rounded-lg cursor-pointer"
          >
            <input id="text-color" v-model="model.color" type="color" class="invisible w-8" />
          </label>
        </template>
      </SfInput>
    </div>
    <div v-if="model.textAlignment !== undefined">
      <fieldset class="py-2">
        <legend class="text-sm font-medium text-black">{{ textAlignLabel }}</legend>
        <div class="w-full inline-flex rounded-lg border border-gray-300 bg-white text-gray-700 overflow-hidden">
          <div
            v-for="option in alignmentOptions"
            :key="option.value"
            :data-testid="`text-align-${option.value}`"
            class="flex items-center justify-center w-1/3 px-4 py-2 cursor-pointer text-sm border-r"
            :class="{ 'bg-gray-100 text-gray-900 font-semibold': model.textAlignment === option.value }"
            @click="model.textAlignment = option.value as 'left' | 'center' | 'right'"
          >
            <SfIconCheck :class="{ invisible: model.textAlignment !== option.value }" class="mr-1 w-[1.1rem]" />
            {{ option.label }}
          </div>
        </div>
      </fieldset>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SfTextarea, SfInput, SfIconCheck } from '@storefront-ui/vue';
import type { BlockTextFieldsGroupProps } from './types';

const props = defineProps<BlockTextFieldsGroupProps>();

const {
  model,
  pretitleLabel,
  pretitlePlaceholder,
  pretitleTestid,
  titleLabel,
  titlePlaceholder,
  titleTestid,
  subtitleLabel,
  subtitlePlaceholder,
  subtitleTestid,
  descriptionLabel,
  descriptionPlaceholder,
  descriptionTestid,
  colorLabel,
  colorTestid,
  textAlignLabel,
  textAlignLeftLabel,
  textAlignCenterLabel,
  textAlignRightLabel,
} = props;

const alignmentOptions = [
  { value: 'left', label: textAlignLeftLabel ?? 'Left' },
  { value: 'center', label: textAlignCenterLabel ?? 'Center' },
  { value: 'right', label: textAlignRightLabel ?? 'Right' },
];
</script>
