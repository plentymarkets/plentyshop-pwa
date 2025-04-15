<template>
  <form ref="referenceRef" role="search" class="relative" @submit.prevent="handleSubmit">
    <SfInput
      id="search-bar"
      ref="inputReference"
      v-model="inputModel"
      :aria-label="t('search')"
      :placeholder="t('search')"
      @focus="open"
    >
      <template #prefix>
        <SfLoaderCircular v-if="loading" />
        <SfIconSearch v-else />
      </template>
      <template #suffix>
        <button
          v-if="inputModel"
          type="button"
          :aria-label="t('resetSearch')"
          class="flex rounded-md focus-visible:outline focus-visible:outline-offset"
          @click="handleReset"
        >
          <SfIconCancel />
        </button>
      </template>
    </SfInput>
  </form>
</template>

<script setup lang="ts">
import { SfIconCancel, SfIconSearch, SfInput, useDisclosure, SfLoaderCircular } from '@storefront-ui/vue';
import { unrefElement } from '@vueuse/core';

const props = defineProps<{
  close?: () => boolean;
}>();

const localePath = useLocalePath();
const { t } = useI18n();
const router = useRouter();
const { open } = useDisclosure();
const { updateSearchTerm } = useCategoryFilter();
const { loading } = useSearch();
const { emit } = usePlentyEvent();

const inputModel = ref('');
const inputReference = ref<HTMLSpanElement>();
const handleInputFocus = () => {
  const inputElement = unrefElement(inputReference)?.querySelector('input');
  inputElement?.focus();
};
const handleReset = () => {
  inputModel.value = '';
  handleInputFocus();
};
const handleSubmit = () => {
  props.close?.();
  updateSearchTerm(inputModel.value);
  emit('frontend:searchProduct', inputModel.value);
  router.push({ path: localePath(paths.search), query: { term: inputModel.value } });
  handleReset();
};

watch(inputModel, () => {
  if (inputModel.value === '') {
    handleReset();
  }
});
</script>
