<template>
  <div class="py-2">
    <p class="mb-4">{{ getEditorTranslation('editShippingPageDescription') }}</p>

    <UiButton :tag="NuxtLink" :to="localePath(paths.shipping)" data-testid="edit-shipping-page-link">
      {{ getEditorTranslation('editShippingPage') }}
      <template #suffix>
        <SfIconArrowForward />
      </template>
    </UiButton>

    <UiAccordionItem v-model="isLegacyOpen" class="mt-6" summary-class="!p-0" content-padding-class="pt-4 px-0">
      <template #summary>
        <span class="font-medium">{{ getEditorTranslation('legacyOptionLabel') }}</span>
      </template>

      <p class="mb-4 text-neutral-500">{{ getEditorTranslation('description') }}</p>
      <div class="flex justify-between mb-2">
        <UiFormLabel>{{ getEditorTranslation('label') }}</UiFormLabel>
      </div>

      <EditorCategorySelect
        v-model="shippingTextCategoryId"
        :base-search-params="{ type: 'in:content', sortBy: 'position_asc,name_asc' }"
        data-test-id="shipping-text-category-id"
      />
    </UiAccordionItem>
  </div>
</template>
<script setup lang="ts">
import { SfIconArrowForward } from '@storefront-ui/vue';

const { updateSetting, getSetting } = useSiteSettings('shippingTextCategoryId');
const localePath = useLocalizedPath();
const NuxtLink = resolveComponent('NuxtLink');
const isLegacyOpen = ref(false);
const shippingTextCategoryId = computed({
  get: () => getSetting()?.toString() ?? null,
  set: (value: string | null) => {
    value ? updateSetting(value) : updateSetting('');
  },
});
</script>

<i18n lang="json">
{
  "en": {
    "editShippingPageDescription": "Configure the /shipping page directly using the page editor and its blocks.",
    "editShippingPage": "Edit shipping policy",
    "legacyOptionLabel": "Legacy option: select category manually",
    "description": "Select the category which should be used for the /shipping page. This page is by default linked wherever shipping prices are mentioned.",
    "label": "Category for shipping information page"
  },
  "de": {
    "editShippingPageDescription": "Configure the /shipping page directly using the page editor and its blocks.",
    "editShippingPage": "Edit shipping policy",
    "legacyOptionLabel": "Legacy option: select category manually",
    "description": "Select the category which should be used for the /shipping page. This page is by default linked wherever shipping prices are mentioned.",
    "label": "Category for shipping information page"
  }
}
</i18n>
