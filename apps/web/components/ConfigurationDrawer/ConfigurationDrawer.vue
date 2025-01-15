<template>
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
      :class="[
        'bg-neutral-50',
        'border',
        'border-gray-300',
        'z-[150]',
        { 'min-w-[400px]': placement === 'left' || placement === 'right' },
      ]"
    >
      <header class="flex items-center justify-between px-10 py-6 bg-primary-500">
        <div class="flex items-center text-white"><SfIconTune class="mr-2" /> App Settings</div>
        <UiButton square variant="tertiary" class="text-white" @click="open = false">
          <SfIconClose />
        </UiButton>
      </header>
      <div class="px-5 py-5">
        <h3>Theme</h3>
        <div class="border border-black p-4 mb-4 rounded-md">
          <div class="py-2 pl-2 flex justify-between min-w-20">
            <div>Primary:</div>
            <div><input v-model="primaryColorReference" type="color" /></div>
          </div>
          <div class="py-2 pl-2 flex justify-between">
            <div>Secondary:</div>
            <div><input v-model="secondaryColorReference" type="color" /></div>
          </div>
        </div>
      </div>
    </SfDrawer>
  </transition>
</template>

<script setup lang="ts">
import type { SfDrawerPlacement } from '@storefront-ui/vue';
import { SfDrawer, SfIconClose, SfIconTune, useTrapFocus } from '@storefront-ui/vue';

const placement = ref<`${SfDrawerPlacement}`>('right');
const drawerReference = ref();

const runtimeConfig = useRuntimeConfig();
const primaryColorReference = ref(runtimeConfig.public.primaryColor);
const secondaryColorReference = ref(runtimeConfig.public.secondaryColor);

const { open, updatePrimaryColor, updateSecondaryColor } = useConfigurationDrawer();

useTrapFocus(drawerReference, { activeState: open });

watch(primaryColorReference, () => {
  updatePrimaryColor(primaryColorReference.value);
});

watch(secondaryColorReference, () => {
  updateSecondaryColor(secondaryColorReference.value);
});
</script>
