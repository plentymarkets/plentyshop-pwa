<template>
  <UiButton
    variant="secondary"
    aria-label="Produktvorschau"
    size="sm"
    class="min-w-[144px] mb-2"
    @click="open = true"
  >
    <SfIconInfo /> Vorschau
  </UiButton>

  <!-- Backdrop -->
  <transition
    enter-active-class="transition duration-200 ease-out"
    leave-active-class="transition duration-200 ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div v-if="open" class="fixed inset-0 bg-neutral-700 bg-opacity-50 z-[1000]" />
  </transition>

  <transition
    enter-active-class="transition duration-500 ease-in-out"
    leave-active-class="transition duration-500 ease-in-out"
    :enter-from-class="placement === 'left' ? '-translate-x-full' : 'translate-x-full'"
    :enter-to-class="placement === 'left' ? 'translate-x-0' : 'translate-x-0'"
    :leave-from-class="placement === 'left' ? 'translate-x-0' : 'translate-x-0'"
    :leave-to-class="placement === 'left' ? '-translate-x-full' : 'translate-x-full'"
  >
    <SfDrawer
      ref="productPreviewRef"
      v-model="open"
      :placement="placement"
      :class="[
        'bg-white',
        'border',
        'h-[100vh]',
        'z-[1000]',
        'w-[100vw] md:w-[50vw] lg:w-[20vw]',
        'border-gray-300'
      ]"
    >
      <header class="flex justify-between items-center p-4 bg-primary-500 text-white mb-5">
        <h3 class="text-lg font-medium">Produktvorschau</h3>
        <SfButton square variant="tertiary" class="text-white" @click="open = false">
          <SfIconClose />
        </SfButton>
      </header>

      <div class="p-5 px-10 mb-5 overflow-x-auto h-[90vh]">
        <!-- Beschreibung -->
        <VariationBulletPoints
          v-if="props.product"
          :fallback="''"
          :product="props.product"
          language="de"
        />
      </div>
    </SfDrawer>
  </transition>
</template>

<script setup lang="ts">
import {
  SfDrawer,
  SfButton,
  SfIconClose,
  SfIconInfo,
  useTrapFocus,
} from '@storefront-ui/vue';
import { ref } from 'vue';
import type { SfDrawerPlacement } from '@storefront-ui/vue';
import type { ProductPreviewProps } from './types';

const props = defineProps<ProductPreviewProps>();
const placement = ref<`${SfDrawerPlacement}`>('left');
const open = ref(false);
const drawerRef = ref();



useTrapFocus(drawerRef, { activeState: open });

</script>


