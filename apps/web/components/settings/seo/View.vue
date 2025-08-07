<template>
  <SiteConfigurationView>
    <template #setting-title> SEO Settings </template>
    <template #setting-description>
      <div class="flex flex-col px-4 py-5 border-t text-sm">
        <p class="pb-2">
          <SfIconInfo size="sm" />
          <span class="px-2 align-middle font-bold">Global defaults</span>
        </p>
        <p>The settings below apply to any page without its own, page-specific settings.</p>
      </div>
    </template>
  </SiteConfigurationView>
</template>

<script setup lang="ts">
import { SfIconInfo } from '@storefront-ui/vue';
const { $registerMessages } = useNuxtApp();

$registerMessages({
  en: { seo: 'SEO Settings', 'social-media': 'Social Media', robots: 'Robots', 'meta-data': 'Meta Data' },
  de: { seo: 'SEO Settings', 'social-media': 'Social Media DE', robots: 'Robots', 'meta-data': 'Meta Data' },
});
</script>
