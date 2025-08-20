<template>
  <div class="flex flex-col items-center justify-start p-10 font-editor">
    <UiButton class="mb-4 mt-20" @click.stop="addNewBlock('bottom')">
      <SfIconAdd class="cursor-pointer text-xl" />
    </UiButton>
    <p class="font-bold text-lg">{{ t('homepage.emptyBlock.headline') }}</p>
  </div>
</template>

<script setup lang="ts">
import { SfIconAdd } from '@storefront-ui/vue';
import type { MultiGridProps } from '~/components/blocks/structure/MultiGrid/types';
const { t } = useI18n();

const { openDrawerWithView } = useSiteConfiguration();
const { togglePlaceholder } = useBlockManager();
const { updateMultigridColumnUuid } = useBlockManager();

const props = defineProps<{ parent?: MultiGridProps, columnUuid?: string }>();
// console.log('EmptyBlock props:', props.parent);

const addNewBlock = (position: 'top' | 'bottom') => {
  if (props.parent?.name === 'MultiGrid') {
    console.log('Adding new block to MultiGrid');
    updateMultigridColumnUuid(props.columnUuid!);
  } else {
    console.log('Adding new block to other structure');
    togglePlaceholder('0', position);
  }
  openDrawerWithView('blocksList');
};
</script>
