<template>
  <Teleport v-if="showGuaranteeNotice" to="#app-container">
    <UiModal v-model="isOpen" tag="section" class="h-full @md:w-[600px] @md:h-fit m-0 p-0 overflow-y-auto">
      <header>
        <UiButton
          :aria-label="t('common.navigation.closeDialog')"
          square
          variant="tertiary"
          class="absolute right-2 top-2"
          @click="isOpen = false"
        >
          <SfIconClose />
        </UiButton>
      </header>
      <GuaranteeNoticeBanner />
    </UiModal>
  </Teleport>

  <div v-if="showGuaranteeNotice" class="w-full flex justify-center mt-4">
    <button type="button" class="cursor-pointer text-center underline hover:no-underline" @click="isOpen = true">
      {{ t('checkout.guaranteeNotice') }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { SfIconClose } from '@storefront-ui/vue';

const isOpen = ref(false);
const { getBooleanSetting } = useSiteSettings('showGuaranteeNotice');

const showGuaranteeNotice = computed(() => getBooleanSetting(true));
</script>
