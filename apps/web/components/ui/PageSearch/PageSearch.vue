<template>
  <div class="absolute left-0 top-full mt-2 bg-white shadow-lg rounded-lg border border-gray-200 overflow-hidden max-w-[400px] w-full sm:w-4/5 md:w-3/4 lg:w-[400px] h-[300px]">
  <Multiselect
      ref="multiselectRef"
      v-model="inputModel"
      data-testid="font-select"
      :options="options"
      placeholder="Search"
      label="name"
      :custom-label="customLabel"
      track-by="name"
      :close-on-select="true"
      :allow-empty="false"
      option-height="40"
      select-label=""
      deselect-label="Selected"
      class="w-full h-full"
      :open="isOpen"
      @close="closeDropdown"
      @select="selectValue"
    >
      <template #option="{ option }">
        <div class="flex items-center px-2 max-h-[300px] w-auto">
          <span class="flex items-center">
            <SfIconHome v-if="option.name === t('homepage.homepagetitle')" class="w-4 h-4 mr-2 font-bold text-gray-900" />
            {{ option.name }}
          </span>
          <span v-if="option.path.split('/').length > 2" class="text-xs ml-2">
            {{ option.path }}
          </span>
        </div>
      </template>
    </Multiselect>
  </div>
</template>

<script lang="ts" setup>
import Multiselect from 'vue-multiselect';
import { SfIconHome } from '@storefront-ui/vue';
const emit = defineEmits(['pageSelected', 'close']);

const inputModel = ref('');

const { pages } = await usePages();

const { locale } = useI18n();
const { t } = useI18n();
const isOpen = ref(true);
const multiselectRef = ref<InstanceType<typeof Multiselect> | null>(null);

const flattenPages = (
  pages: { name: string; path: string; children?: unknown[] }[],
): { name: string; path: string }[] => {
  let flatPages: { name: string; path: string }[] = [];
  pages.forEach((page) => {
    flatPages.push({ name: page.name, path: page.path });
    if (page.children) {
      flatPages = flatPages.concat(
        flattenPages(page.children as { name: string; path: string; children?: unknown[] }[]),
      );
    }
  });
  return flatPages;
};
const options = ref(flattenPages(pages.value));
const customLabel = ({ name, path }: { name: string; path: string }): string => {
  return `${name} – ${path}`;
};

const open = () => {
  if (multiselectRef.value) {
    (multiselectRef.value).activate();
  }
};

const closeDropdown = () => {
  emit ('close');
};

const selectValue = (page: { name: string; path: string }) => {
  emit('pageSelected', { name: page.name, icon: page.name === t('homepage.homepagetitle') ? 'home' : 'sell' });
  navigateTo(`/${locale.value}${page.path}`);
};
onMounted(() => {
  open();
});
</script>
<style scoped>
:deep .multiselect__option--highlight  {
  background-color: #f7fafc !important;
  color: #1a202c
}
</style>
