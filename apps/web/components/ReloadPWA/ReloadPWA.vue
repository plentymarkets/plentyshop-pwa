<template>
  <div
    v-if="needRefresh"
    class="fixed right-4 bottom-4 p-4 border border-primary-500 rounded z-[1000] bg-white shadow-lg flex items-center gap-4"
    role="alert"
  >
    <div>
      <span>{{ t('reloadPWA.newVersionAvailable') }}</span>
    </div>
    <UiButton 
    :aria-label="t('reloadPWA.ariaLabel')" @click="updatePWA">
      {{ t('reloadPWA.refresh') }}
    </UiButton>
  </div>
</template>

<script setup lang="ts">
const { $pwa } = useNuxtApp();
const { t } = useI18n();

const needRefresh = computed(() => $pwa?.needRefresh);

const updatePWA = async () => {
  await $pwa?.updateServiceWorker();
};
</script>
