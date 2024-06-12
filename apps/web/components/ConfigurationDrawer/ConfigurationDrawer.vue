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
        'z-50',
        { 'max-w-[370px]': placement === 'left' || placement === 'right' },
      ]"
    >
      <header class="flex items-center justify-between px-10 py-6 bg-primary-700">
        <div class="flex items-center text-white"><SfIconTune class="mr-2" /> App Settings</div>
        <SfButton square variant="tertiary" class="text-white" @click="open = false">
          <SfIconClose />
        </SfButton>
      </header>
      <h3>Theme</h3>
      <div class="p-5 px-10">
        Primary:
        <input type="color" v-model="primaryColorReference" />
      </div>
      <div class="p-5 px-10">
        Secondary:
        <input type="color" v-model="secondaryColorReference" />
      </div>
      <h3>General</h3>
      <div class="flex items-center">
        <SfCheckbox id="newsletterNamesCheckbox" v-model="showNames" class="peer" />
        <label
          class="ml-3 text-base text-gray-900 cursor-pointer font-body peer-disabled:text-disabled-900"
          for="newsletterNamesCheckbox"
        >
          Newsletter form
        </label>
      </div>
      <div class="flex justify-between ml-8">
        <p class="typography-hint-xs mt-0.5 text-neutral-500">Show names</p>
      </div>
    </SfDrawer>
  </transition>
</template>

<script setup lang="ts">
import {
  SfDrawer,
  SfButton,
  SfIconClose,
  SfIconTune,
  SfDrawerPlacement,
  useTrapFocus,
  SfCheckbox,
} from '@storefront-ui/vue';

const placement = ref<`${SfDrawerPlacement}`>('right');
const drawerReference = ref();
const primaryColorReference = ref();
const secondaryColorReference = ref();
const { open, updatePrimaryColor, updateSecondaryColor } = useConfigurationDrawer();
const { showNames } = useNewsletter();

useTrapFocus(drawerReference, { activeState: open });

watch(primaryColorReference, () => {
  updatePrimaryColor(primaryColorReference.value);
});

watch(secondaryColorReference, () => {
  updateSecondaryColor(secondaryColorReference.value);
});
</script>
