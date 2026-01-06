<template>
  <UiButton variant="primary" square :aria-label="title" @click="open = true">
    {{ title }}
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
    <div v-if="open" class="fixed inset-0 bg-neutral-700 bg-opacity-50 z-10" />
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
      ref="drawerRef"
      v-model="open"
      :placement="placement"
      :class="'bg-white h-[100vh] z-20 w-[100vw] md:w-[50vw] lg:w-[20vw]'"
    >
      <header class="flex justify-between items-center p-4 bg-primary-500 text-white mb-5">
        <h3 class="text-lg font-medium">{{ title }}</h3>

        <UiButton
          variant="tertiary"
          square
          :aria-label="t('closeMenu')"
          class="absolute right-2 top-2 hover:bg-transparent active:bg-transparent"
          @click="open = false"
        >
          <SfIconClose class="text-white" />
        </UiButton>
      </header>

      <section class="p-4">
        <client-only>
          <template v-if="loading">
            <div class="flex justify-center py-10">
              <SfLoaderCircular size="lg" />
            </div>
          </template>

          <template v-else-if="error">
            <div class="text-red-600">{{ error }}</div>
          </template>

          <template v-else>
            <div v-html="content" />
          </template>
        </client-only>
      </section>
    </SfDrawer>
  </transition>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { SfDrawer, SfLoaderCircular, SfIconClose, useTrapFocus } from '@storefront-ui/vue';
import type { SfDrawerPlacement } from '@storefront-ui/vue';
import { useLazyContent } from '~/composables/useLazyContent/useLazyContent';
import type { LazyContentDrawerProps } from './types';

const props = defineProps<LazyContentDrawerProps>();

const placement = ref<`${SfDrawerPlacement}`>('left');
const drawerRef = ref();
const open = ref(false);
useTrapFocus(drawerRef, { activeState: open });

// Composable
const { content, loading, error, hasLoaded, loadContent } = useLazyContent();

// Wenn Drawer geöffnet wird → Inhalt laden
watch(open, (value) => {
  if (value && !hasLoaded.value) {
    loadContent(props.categoryid);
  }
});

// SSR-Schutz
const isClient = ref(false);
onMounted(() => {
  isClient.value = true;
});
</script>
