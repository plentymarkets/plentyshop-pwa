<template>
  <div class="sticky top-0 bg-white py-2 z-50">
    <div class="relative flex items-center pr-5">
      <div class="absolute left-1/2 transform -translate-x-1/2">
        <UiLanguageEditor v-if="experimentalAddBlock" />
      </div>
      <div class="ml-auto flex space-x-2">
        <UiButton
          variant="secondary"
          :size="buttonSize"
          class="self-start"
          @click="toggleEdit"
          :disabled="!isEditingEnabled"
          data-testid="edit-preview-button"
        >
          {{ disableActions ? 'Preview' : 'Edit' }}
        </UiButton>
        <UiButton
          variant="primary"
          :size="buttonSize"
          class="self-start"
          :disabled="!isEditingEnabled || !isLocalTemplate()"
          data-testid="edit-save-button"
          @click="updatePageTemplate"
        >
          <template v-if="loading">
            <SfLoaderCircular class="animate-spin w-4 h-4" />
          </template>

          <template v-else> Save </template>
        </UiButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SfLoaderCircular } from '@storefront-ui/vue';
const { isEditingEnabled, disableActions } = useEditor();

const viewport = useViewport();
const buttonSize = computed(() => {
  return viewport.isLessThan('md') ? 'sm' : 'lg';
});

const { loading } = useHomepage();
const { updatePageTemplate } = useUpdatePageTemplate();

const runtimeConfig = useRuntimeConfig();
const homepageCategoryId = runtimeConfig.public.homepageCategoryId;
const experimentalAddBlock = runtimeConfig.public.experimentalAddBlock;

const isLocalTemplate = () => typeof homepageCategoryId === 'number';

const toggleEdit = () => {
  disableActions.value = !disableActions.value;
};
</script>
