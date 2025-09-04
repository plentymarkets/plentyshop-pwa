<template>
    <div
        v-if="needRefresh"
        class="fixed right-4 bottom-4 p-4 border border-gray-400 rounded z-[1000] bg-white shadow-lg flex items-center gap-4"
        role="alert"
    >
        <div class="mb-2">
            <span>{{ t('reloadPWA.newVersionAvailable') }}</span>
        </div>
        <UiButton @click="updatePWA">
            {{ t('reloadPWA.refresh') }}
        </UiButton>
    </div>
</template>

<script setup lang="ts">
const { $pwa } = useNuxtApp()
const { t } = useI18n();

const needRefresh = computed(() => $pwa?.needRefresh)

const updatePWA = async () => {
    await $pwa?.updateServiceWorker()
}
</script>