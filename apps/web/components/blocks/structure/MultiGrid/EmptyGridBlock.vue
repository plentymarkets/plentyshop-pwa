<template>
  <div v-if="$isPreview" class="flex w-full">
    <div
      v-if="drawerOpen && isActiveColumn"
      data-testid="active-empty-multicolumn"
      class="h-[196px] flex-1 border-2 border-dashed border-sky-400 bg-sky-50 p-6 flex flex-col items-center justify-center text-center"
    >
      <p class="font-semibold text-gray-800">{{ getEditorTranslation('placeholder') }}</p>
      <p class="text-sm text-gray-500">{{ getEditorTranslation('choose') }}</p>
    </div>
    <div
      v-else
      data-testid="inactive-empty-multicolumn"
      class="h-[196px] flex-1 border-2 border-dashed border-gray-400 bg-gray-50 p-6 flex flex-col items-center justify-center text-center cursor-pointer"
      @click.stop="addBlockToColumn()"
    >
      <span class="text-xl font-bold text-gray-700"><SfIconAdd class="text-xl" /></span>
      <p class="font-semibold text-gray-800 text-sm">Add block</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SfIconAdd } from '@storefront-ui/vue';
import type { EmptyGridBlockProps } from '~/components/blocks/structure/MultiGrid/types';

const { $isPreview } = useNuxtApp();
const props = defineProps<EmptyGridBlockProps>();
const { multigridColumnUuid, updateMultigridColumnUuid, visiblePlaceholder } = useBlockManager();
const { openDrawerWithView, drawerOpen } = useSiteConfiguration();

const isActiveColumn = computed(() => multigridColumnUuid.value === props.meta.uuid);

const addBlockToColumn = () => {
  updateMultigridColumnUuid(props.meta.uuid);
  openDrawerWithView('blocksList');
  visiblePlaceholder.value = { uuid: '', position: 'top' };
};
</script>

<i18n lang="json">
{
  "en": {
    "placeholder": "Block will be placed here",
    "choose": "Choose one from templates"
  },
  "de": {
    "placeholder": "Block will be placed here",
    "choose": "Choose one from templates"
  }
}
</i18n>
