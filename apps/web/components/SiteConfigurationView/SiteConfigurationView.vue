<template>
  <div class="site-settings-view sticky top-[52px]" data-testid="site-settings-drawer">
    <header class="flex items-center justify-between px-4 py-5 border-b">
      <div class="flex items-center text-xl font-bold">
        <slot name="setting-group-title" />
      </div>
      <button data-testid="design-view-close" class="!p-0" @click="closeDrawer">
        <SfIconClose />
      </button>
    </header>

    <div class="h-[calc(100vh-150px)] overflow-y-auto">
      <SettingsGroup>
        <template #settings-group-title>Fonts</template>
        <SettingsDesignFontsGlobalFonts />
      </SettingsGroup>

      <SettingsGroup>
        <template #settings-group-title>Colors</template>
        <SettingsDesignColorsPrimaryColor />
        <SettingsDesignColorsSecondaryColor />
      </SettingsGroup>

      <SettingsGroup>
        <template #settings-group-title>Header</template>
        <SettingsDesignHeaderBackgroundColor />
        <SettingsDesignHeaderIconColor />
      </SettingsGroup>

      <SettingsGroup>
        <template #settings-group-title>Blocks spacing</template>
        <SettingsDesignBlockSpacing />
      </SettingsGroup>
    </div>
  </div>
</template>

<script setup lang="ts">
import 'vue-multiselect/dist/vue-multiselect.min.css';
import { SfIconClose } from '@storefront-ui/vue';

const { closeDrawer } = useSiteConfiguration();
</script>
