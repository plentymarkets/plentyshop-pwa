<template>
  <div>
    <Editor
      v-if="isEditing && currentBlockIndex !== null"
      :index="currentBlockIndex"
      :block="currentBlock"
      @update="updateBlock"
    />
    <div v-else class="content">
      <template v-for="(block, index) in data.blocks" :key="index">
        <div
          :class="[
            'relative max-w-screen-3xl mx-auto md:px-6 lg:px-10 mt-3 mb-10 group',
            {
              'outline outline-4 outline-[#538AEA]':
                isPreview && disableActions && isClicked && isTablet && clickedBlockIndex === index,
            },
            { 'hover:outline hover:outline-4 hover:outline-[#538AEA]': isPreview && disableActions && !isTablet },
          ]"
          @click="tabletEdit(index)"
        >
          <button
            v-if="experimentalAddBlock && disableActions && isPreview"
            @click="addNewBlock(index, -1)"
            :class="[
              'absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 rounded-[18px] p-[6px] bg-[#538aea] text-white opacity-0',
              { 'opacity-100': isClicked && clickedBlockIndex === index },
              'group-hover:opacity-100 group-focus:opacity-100',
            ]"
          >
            <SfIconAdd class="cursor-pointer"></SfIconAdd>
          </button>
          <UiBlockActions
            v-if="disableActions && blockHasData(block) && isPreview"
            :index="index"
            @edit="handleEdit"
            @delete="deleteBlock"
          />
          <component
            v-if="block.name !== 'NewsletterSubscribe' || showNewsletter"
            :is="getComponent(block.name)"
            v-bind="block.options"
          />
          <button
            v-if="experimentalAddBlock && disableActions && isPreview"
            @click="addNewBlock(index, 1)"
            :class="[
              'absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 z-50 rounded-[18px] p-[6px] bg-[#538aea] text-white opacity-0',
              { 'opacity-100': isClicked && clickedBlockIndex === index },
              'group-hover:opacity-100 group-focus:opacity-100',
            ]"
          >
            <SfIconAdd class="cursor-pointer"></SfIconAdd>
          </button>
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { SfIconAdd } from '@storefront-ui/vue';
import { Block } from '~/composables/useHomepage/types';

const { isEditing, disableActions } = useEditor();
const viewport = useViewport();

const { data, fetchPageTemplate } = useHomepage();
const { fetchCategoryTemplate } = useCategoryTemplate();
const { showNewsletter } = useNewsletter();

const addNewBlock = (index: number, position: number) => {
  const insertIndex = position === -1 ? index : index + 1;
  const updatedBlocks = [...data.value.blocks];

  updatedBlocks.splice(insertIndex, 0, {
    name: 'UiMediaCard',
    options: {
      text: "<div class='flex flex-col mt-5 sm:mt-20 mt-0 sm:p-0 p-5 text-center sm:text-left'><span class='text-xl font-bold mb-2'>Experience the Future of Sound</span><h2 class='text-2xl font-semibold mb-4'>Redefine Your Listening Experience</h2><p class='typography-text-sm md:typography-text-lg mb-6 padding-right-desktop'>Our latest collection of headphones is designed to deliver unparalleled audio precision, with deep bass, clear highs, and an immersive experience for every genre of music. Combining sleek design, comfort, and cutting-edge technology, these headphones are made for those who refuse to compromise on sound quality.</p><ul class='list-disc list-inside typography-text-sm md:typography-text-lg '><li>Premium, studio-quality sound</li><li>Comfortable fit for extended listening</li><li>Long-lasting battery life</li><li>Seamless wireless connectivity</li></ul></div>",
      image: 'https://cdn02.plentymarkets.com/mevofvd5omld/frontend/headphones-mediacard.avif',
      alt: 'Headphones',
      alignment: 'right',
    },
  });

  data.value = {
    ...data.value,
    blocks: updatedBlocks,
  };
};

const currentBlock = ref<Block | null>(null);
const currentBlockIndex = ref<number | null>(null);
const isClicked = ref(false);
const clickedBlockIndex = ref<number | null>(null);

const isTablet = computed(() => viewport.isLessThan('lg') && viewport.isGreaterThan('sm'));

const isPreview = ref(false);
const config = useRuntimeConfig().public;
const showConfigurationDrawer = config.showConfigurationDrawer;
const experimentalAddBlock = ref(config.experimentalAddBlock);

onMounted(() => {
  const pwaCookie = useCookie('pwa');
  isPreview.value = !!pwaCookie.value || (showConfigurationDrawer as boolean);
});

const isEmptyBlock = (block: Block): boolean => {
  const options = block?.options;
  return !options || (typeof options === 'object' && Object.keys(options).length === 0);
};
const blockHasData = (block: Block): boolean => {
  return !isEmptyBlock(block);
};
const tabletEdit = (index: number) => {
  if (isTablet.value) {
    isClicked.value = !isClicked.value;
    clickedBlockIndex.value = isClicked.value ? index : null;
  }
};
const handleEdit = (index: number) => {
  if (data.value.blocks && data.value.blocks.length > index) {
    currentBlockIndex.value = index;
    currentBlock.value = data.value.blocks[index];
    isEditing.value = true;
  }
};

const deleteBlock = (index: number) => {
  if (data.value.blocks && index !== null && index < data.value.blocks.length) {
    data.value.blocks.splice(index, 1);
  }
};

const updateBlock = (index: number, updatedBlock: Block) => {
  if (data.value.blocks && index !== null && index < data.value.blocks.length) {
    data.value.blocks[index] = updatedBlock;
  }
};

const getComponent = (name: string) => {
  if (name === 'NewsletterSubscribe') {
    return resolveComponent('NewsletterSubscribe');
  }

  if (name === 'UiHeroCarousel') {
    return resolveComponent('UiHeroCarousel');
  }

  if (name === 'UiMediaCard') {
    return resolveComponent('UiMediaCard');
  }

  if (name === 'ProductRecommendedProducts') {
    return resolveComponent('ProductRecommendedProducts');
  }
};

const runtimeConfig = useRuntimeConfig();

await fetchCategoryTemplate(runtimeConfig.public.homepageCategoryId);

fetchPageTemplate();
</script>
