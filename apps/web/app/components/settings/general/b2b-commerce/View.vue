<template>
  <SiteConfigurationView>
    <template #setting-title>{{ getEditorTranslation('groups-title') }}</template>

    <template #setting-description>
      <div class="flex flex-col px-4 text-sm">
        <p class="pb-2">
          <span class="align-middle font-bold">{{ getEditorTranslation('description') }}</span>
        </p>
      </div>
    </template>
  </SiteConfigurationView>
</template>

<script setup lang="ts">
const { fetchCustomerClasses } = useCustomerClass();

onMounted(async () => {
  await fetchCustomerClasses();
});
</script>

<i18n lang="json">
{
  "en": {
    "groups-title": "B2B Commerce",
    "description": "Assign default customer classes for B2B customers."
  },
  "de": {
    "groups-title": "B2B Commerce",
    "description": "Assign default customer classes for B2B customers."
  }
}
</i18n>
