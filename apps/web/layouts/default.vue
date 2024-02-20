<template>
  <div>
    <UiHeader />
    <template v-if="breadcrumbs?.length">
      <NarrowContainer>
        <div class="p-4 md:px-0">
          <LazyUiBreadcrumbs :breadcrumbs="breadcrumbs" />
        </div>
      </NarrowContainer>
    </template>
    <main>
      <slot />
    </main>
    <NuxtLazyHydrate when-idle>
      <UiNavbarBottom />
      <Cookiebar />
      <PreviewMode />
    </NuxtLazyHydrate>
    <NuxtLazyHydrate when-visible>
      <UiFooter />
    </NuxtLazyHydrate>
    <NuxtLazyHydrate when-idle>
      <SfModal
        v-model="isSearchModalOpen"
        class="w-full h-full z-50"
        tag="section"
        role="dialog"
        aria-labelledby="search-modal-title"
      >
        <header class="mb-4">
          <SfButton square variant="tertiary" class="absolute right-4 top-2" @click="searchModalClose">
            <SfIconClose class="text-neutral-500" />
          </SfButton>
          <h3 id="search-modal-title" class="absolute left-6 top-4 font-bold typography-headline-4 mb-4">
            {{ t('search') }}
          </h3>
        </header>
        <UiSearch :close="searchModalClose" />
      </SfModal>
    </NuxtLazyHydrate>
  </div>
</template>

<script setup lang="ts">
import { SfButton, SfIconClose, SfModal, useDisclosure } from '@storefront-ui/vue';
import { DefaultLayoutProps } from '~/layouts/types';
const { t } = useI18n();
usePageTitle();

defineProps<DefaultLayoutProps>();

const { isOpen: isSearchModalOpen, close: searchModalClose } = useDisclosure();
const { setLogoMeta } = useStructuredData();

setLogoMeta();
</script>
