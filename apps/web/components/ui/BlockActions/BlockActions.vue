<template>
  <div
    class="absolute right-0 top-1/2 transform -translate-y-1/2 flex flex-col space-y-2 mt-2 mr-2 border border-[#538AEA] rounded-[6px]"
  >
    <UiButton
      @click="editBlock"
      class="text-white rounded hover:bg-transparent active:bg-transparent !px-1"
      variant="tertiary"
      size="sm"
    >
      <SfIconBase size="xs" viewBox="0 0 18 18" class="fill-primary-900 cursor-pointer">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0.00219727 14.2524V18H3.74849L14.801 6.94746L11.0547 3.19731L0.00219727 14.2524ZM17.703 4.0481C17.7964 3.95561 17.8705 3.84551 17.9211 3.72419C17.9717 3.60286 17.9978 3.47271 17.9978 3.34125C17.9978 3.20979 17.9717 3.07964 17.9211 2.95831C17.8705 2.83699 17.7964 2.7269 17.703 2.6344L15.3639 0.295378C15.2715 0.20181 15.1615 0.127519 15.0401 0.0768144C14.9188 0.0261096 14.7886 0 14.6571 0C14.5256 0 14.3954 0.0261096 14.274 0.0768144C14.1527 0.127519 14.0426 0.20181 13.9502 0.295378L12.124 2.12933L15.8716 5.87691L17.7004 4.0481H17.703Z"
            fill="black"
          />
        </svg>
      </SfIconBase>
    </UiButton>
    <hr class="w-[15px] mx-auto bg-black border-0 h-[1px]" />
    <UiButton class="text-[#000] rounded hover:bg-transparent active:bg-transparent !px-1" variant="tertiary" size="sm">
      <SfIconBase size="xs" viewBox="0 0 18 18" class="fill-primary-900 cursor-pointer">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M6 2C6 1.44772 6.44772 1 7 1H11C11.5523 1 12 1.44772 12 2H15C15.5523 2 16 2.44772 16 3C16 3.55228 15.5523 4 15 4H3C2.44772 4 2 3.55228 2 3C2 2.44772 2.44772 2 3 2H6ZM4 5H14V14C14 14.5523 13.5523 15 13 15H5C4.44772 15 4 14.5523 4 14V5ZM6 7C6 6.44772 6.44772 6 7 6C7.55228 6 8 6.44772 8 7V12C8 12.5523 7.55228 13 7 13C6.44772 13 6 12.5523 6 12V7ZM10 7C10 6.44772 10.4477 6 11 6C11.5523 6 12 6.44772 12 7V12C12 12.5523 11.5523 13 11 13C10.4477 13 10 12.5523 10 12V7Z"
            fill="black"
          />
        </svg>
      </SfIconBase>
    </UiButton>
  </div>
</template>

<script lang="ts" setup>
import { SfIconBase } from '@storefront-ui/vue';
import { ref } from 'vue';
import { Block } from '~/composables/useHomepage/types';

const props = defineProps<{ block: Block }>();

const { isEditing } = useEditor();
const currentBlock = ref<Block | null>(null);

const editBlock = () => {
  currentBlock.value = props.block;
  isEditing.value = true;
};
</script>
