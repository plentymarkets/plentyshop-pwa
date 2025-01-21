<template>
  <div class="flex justify-between mt-8 mb-10 px-4 md:px-0">
    <h1 class="font-bold typography-headline-3 md:typography-headline-2">{{ heading }}</h1>
    <UiButton class="flex md:hidden whitespace-nowrap" size="sm" variant="tertiary" @click="goToPath">
      <template #prefix>
        <SfIconArrowBack />
      </template>
      {{ labelMobile }}
    </UiButton>
    <UiButton class="hidden md:flex" variant="tertiary" @click="goToPath">
      <template #prefix>
        <SfIconArrowBack />
      </template>
      {{ labelDesktop }}
    </UiButton>
  </div>
</template>

<script setup lang="ts">
import { SfIconArrowBack } from '@storefront-ui/vue';
import type { HeaderWithLinkProps } from '~/components/HeaderWithLink/types';

const localePath = useLocalePath();
const router = useRouter();

const props = defineProps<HeaderWithLinkProps>();

const goToPath = () => {
  props.link ? navigateTo(localePath(props.link)) : router.go(-1);
};
</script>
