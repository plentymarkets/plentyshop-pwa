<template>
  <div>
    <EmptyBlock v-if="dataIsEmpty" />

    <SlickList
      v-else
      v-model:list="data"
      tag="div"
      class="content"
      lock-axis="y"
      use-drag-handle
      helper-class="sortable-ghost"
      :transition-duration="300"
      :dragged-settling-duration="300"
      :press-delay="0"
      :press-threshold="5"
      :distance="0"
      v-on="listeners"
    >
    <template #default>
      <SlickItem
        v-for="(block, index) in data"
        :key="block.meta.uuid"
        :index="index"
        v-on="listeners"
      >
        <div
          :id="`block-${index}`"
          class="group block-wrapper"
          :class="[
              { 'max-w-screen-3xl mx-auto lg:px-10 mt-3': block.name !== 'Banner' && block.name !== 'Carousel' },
              { 'px-4 md:px-6': block.name !== 'Carousel' && block.name !== 'Banner' && block.name !== 'NewsletterSubscribe' },
            ]"
          data-testid="block-wrapper"
          @click="tabletEdit(index)"
        >
          <PageBlock
            :index="index"
            :block="block"
            :disable-actions="disableActions"
            :is-clicked="isClicked"
            :clicked-block-index="clickedBlockIndex"
            :is-tablet="isTablet"
            :block-has-data="blockHasData"
            :change-block-position="changeBlockPosition"
            :root="true"
          />
        </div>
      </SlickItem>
    </template>
    </SlickList>
  </div>
</template>

<script lang="ts" setup>
import { SlickList, SlickItem } from 'vue-slicksort'
import type { EditablePageProps } from './types'

const props = defineProps<EditablePageProps>()
const { data, getBlocks } = useCategoryTemplate()
await getBlocks(props.identifier, props.type)
const dataIsEmpty = computed(() => data.value.length === 0)

const { disableActions } = useEditor()
const {
  isClicked,
  clickedBlockIndex,
  isTablet,
  blockHasData,
  tabletEdit,
  changeBlockPosition,
} = useBlockManager()

const listeners = {
  'touchstart.passive': () => {},
  'touchmove.passive': () => {},
  'touchend.passive': () => {}
}
</script>

<style>
.sortable-ghost {
  opacity: 0.6;
  background: #f0f4ff;
  border-radius: 8px;
}
.sortable-drag {
  opacity: 1 !important;
  transform: scale(1.02);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}
.sortable-chosen .block-wrapper {
  outline: none !important;
}
.sortable-chosen .add-block-button,
.sortable-chosen .block-actions {
  opacity: 0 !important;
}
.sortable-chosen {
  opacity: 0.6;
  background: #f0f4ff;
  border-radius: 8px;
}

@supports (touch-action: none) {
  * {
    touch-action: pan-y;
    -webkit-overflow-scrolling: touch;
  }
}
</style>
