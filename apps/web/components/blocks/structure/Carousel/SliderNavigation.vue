<template>
  <div class="mb-6">
    <div class="flex item-center justify-between mb-4 p-4 pr-2">
      <h2>Slides</h2>
      <div class="flex item-center">
        <!-- Quick Add Slide Button -->
        <button
          data-testid="quick-add-slide-button"
          class="p-2 text-gray-600 hover:bg-gray-100 rounded-full shrink-0"
          @click="$emit('addSlide')"
        >
          <SfIconAdd class="text-neutral-500" />
        </button>

        <!-- "More" Menu & Slide Actions -->
        <div class="relative">
          <button
            v-if="slides.length >= 2"
            data-testid="open-slide-actions"
            class="p-2 text-gray-600 hover:bg-gray-100 rounded-full"
            @click="$emit('open')"
          >
            <SfIconMoreHoriz class="text-neutral-500" />
          </button>

          <div
            v-if="isOpen && slides.length >= 2"
            class="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border z-50"
          >
            <div class="flex justify-end p-2">
              <SfIconClose class="cursor-pointer" @click="$emit('close')" />
            </div>
            <hr />
            <div class="p-2">
              <div
                v-for="(slide, index) in slides"
                :key="index"
                class="flex items-center justify-between p-2 rounded"
              >
                <div class="flex items-center">
                  <!-- Move Slide Up -->
                  <SfIconArrowUpward
                    v-if="index !== 0"
                    :data-testid="`actions-move-slide-up-${index}`"
                    class="cursor-pointer text-neutral-500 mr-2"
                    size="sm"
                    @click.stop="$emit('moveSlideUp', index)"
                  />
                  <SfIconArrowUpward
                    v-else
                    class="cursor-pointer text-neutral-500 mr-2 pointer-events-none opacity-50"
                    size="sm"
                  />

                  <!-- Move Slide Down -->
                  <SfIconArrowDownward
                    v-if="index + 1 !== slides.length"
                    :data-testid="`actions-move-slide-down-${index}`"
                    class="cursor-pointer text-neutral-500 mr-2"
                    size="sm"
                    @click.stop="$emit('moveSlideDown', index)"
                  />
                  <SfIconArrowDownward
                    v-else
                    class="cursor-pointer text-neutral-500 mr-2 pointer-events-none opacity-50"
                    size="sm"
                  />

                  <span>Slide {{ index + 1 }}</span>
                </div>

                <!-- Delete Slide -->
                <button
                  :data-testid="`actions-delete-slide-${index}`"
                  class="text-red-500 hover:text-red-700"
                  :disabled="slides.length === 1"
                  @click="$emit('deleteSlide', index)"
                >
                  <SfIconDelete class="text-neutral-500" />
                </button>
              </div>

              <hr />
              <!-- Add Slide (again inside the menu) -->
              <div class="pl-2 pr-2 pt-2 flex justify-between items-center">
                <p>Add Slide</p>
                <button
                  data-testid="actions-add-slide-button"
                  class="p-2 text-gray-600 hover:bg-gray-100 rounded-full shrink-0"
                  @click="$emit('addSlide')"
                >
                  <SfIconAdd class="text-neutral-500" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Slide Selection Buttons -->
    <SfScrollable
      class="items-center w-full [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
    >
      <template #previousButton="defaultProps">
        <button
          v-bind="defaultProps"
          class="p-1 text-gray-500 hover:text-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <SfIconChevronLeft class="text-neutral-500" />
        </button>
      </template>

      <template #nextButton="defaultProps">
        <button
          v-bind="defaultProps"
          class="p-1 text-gray-500 hover:text-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <SfIconChevronRight class="text-neutral-500" />
        </button>
      </template>

      <div class="flex items-center gap-2 flex-nowrap">
        <button
          v-for="(_, index) in slides"
          :key="index"
          :data-testid="`slide-settings-${index}`"
          class="px-4 py-2 text-sm font-medium rounded-lg flex items-center gap-2 shrink-0"
          :class="activeSlide === index ? 'bg-editor-button text-white' : ''"
          @click="$emit('slideClick', index)"
        >
          Slide {{ index + 1 }}
        </button>
      </div>
    </SfScrollable>
  </div>
</template>

<script setup lang="ts">
import {
  SfScrollable,
  SfIconChevronLeft,
  SfIconChevronRight,
  SfIconDelete,
  SfIconMoreHoriz,
  SfIconArrowUpward,
  SfIconArrowDownward,
  SfIconAdd,
  SfIconClose,
} from '@storefront-ui/vue';
import { PropType } from 'vue';
import type { BannerProps } from '~/components/blocks/BannerCarousel/types';

const props = defineProps({
  slides: {
    type: Array as PropType<BannerProps[]>,
    required: true,
  },
  activeSlide: {
    type: Number,
    default: 0,
  },
  isOpen: {
    type: Boolean,
    default: false,
  },
});
</script>
