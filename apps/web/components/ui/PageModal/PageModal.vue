<template>
  <UiModal
    v-model="pageModalOpen"
    aria-labelledby="page-modal"
    tag="section"
    role="dialog"
    class="h-full md:w-[500px] md:h-fit m-0 p-0 overflow-y-auto page-modal"
    overlay-classes="z-[1000]"
  >
    <header class="flex items-center justify-between mb-2">
      <div class="flex items-center text-xl font-bold">Add page</div>
      <button class="absolute right-2 top-2 px-4 py-4" @click="closeModal">
        <SfIconClose />
      </button>
    </header>

    <p class="mb-6">Add name and type in order to add a new page</p>
    <form data-testid="add-page-form" class="flex flex-col rounded-md gap-4" novalidate @submit.prevent="onSubmit">
      <div class="mb-6">
        <UiFormLabel class="mb-1">Page Name</UiFormLabel>
        <SfInput
          v-bind="pageNameAttributes"
          v-model="pageName"
          name="pageName"
          type="text"
          placeholder="Page Name"
          data-testid="new-page-name"
          :invalid="Boolean(errors['pageName'])"
        />
        <ErrorMessage as="div" name="pageName" class="text-negative-700 text-left text-sm pt-[0.2rem]" />
      </div>
      <div class="mb-6">
        <UiFormLabel class="mb-1">Page Type</UiFormLabel>
        <Multiselect
          v-model="pageType"
          data-testid="new-page-type"
          :options="pageTypes"
          label="label"
          track-by="value"
          placeholder="Select a page type"
          :allow-empty="false"
          class="cursor-pointer"
          select-label=""
          deselect-label="Selected"
        />
      </div>
      <div class="mb-6">
        <UiFormLabel class="mb-1">Parent Page</UiFormLabel>
        <Multiselect
          v-model="parentPage"
          :options="allCategories"
          :custom-label="getLabel"
          :loading="loadingContent || loadingItem"
          :searchable="true"
          :internal-search="false"
          class="cursor-pointer"
          select-label=""
          deselect-label="Selected"
          label="details[0].name"
          placeholder="Select a parent page"
          track-by="id"
          @search-change="handleSearch"
        />
      </div>

      <div class="actions grid gap-4 grid-cols-2">
        <button
          type="button"
          data-testid="block-spacing-btn"
          class="border border-editor-button w-full py-2 rounded-md flex align-center justify-center text-editor-button"
          @click="closeModal"
        >
          Cancel
        </button>
        <button
          type="submit"
          data-testid="block-spacing-btn"
          class="border border-editor-button bg-editor-button w-full py-2 rounded-md flex align-center justify-center text-white"
        >
          Add page
        </button>
      </div>
    </form>
  </UiModal>
</template>

<script setup lang="ts">
import { SfIconClose, SfInput } from '@storefront-ui/vue';
import Multiselect from 'vue-multiselect';
import { useForm, ErrorMessage } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/yup';
import { object, string } from 'yup';
import { useCategory } from '@/composables/useCategory';
import { useSiteConfiguration } from '@/composables/useSiteConfiguration';

const validationSchema = toTypedSchema(
  object({
    pageName: string().required('Enter a page name').default(''),
  }),
);

const { errors, meta, defineField, handleSubmit, resetForm } = useForm({
  validationSchema,
});

const [pageName, pageNameAttributes] = defineField('pageName');
const pageTypes = ref([
  { label: 'Content', value: 'content' },
  { label: 'Item category', value: 'item' },
]);
const pageType = ref(pageTypes.value[0]);
const parentPage = ref();
const lastQuery = ref('');

const { pageModalOpen, togglePageModal } = useSiteConfiguration();
const { addCategory } = useCategory();
const {
  getCategories,
  contentItems,
  itemItems,
  fetchContentCategories,
  fetchItemCategories,
  loadingContent,
  loadingItem,
  data,
} = useCategoriesSearch();

onMounted(() => {
  console.log('test munted')
  fetchContentCategories();
  fetchItemCategories();
});
console.log('contentItems', contentItems.value, itemItems.value);
// const allCategories = computed(() => [...contentItems.value, ...itemItems.value]);
const allCategories = computed(() =>
  lastQuery.value && data.value?.entries?.length ? data.value.entries : [...contentItems.value, ...itemItems.value]
);

const getLabel = (option: CategoryTreeItem) => option?.details?.[0]?.name || '';

const handleSearch = async (query: string) => {
  if (!query) return;
  await getCategories({
    type: 'in:item,content',
    with: 'details,clients',
    sortBy: 'position_asc,name_asc',
    columns: '*',
    page: 1,
    itemsPerPage: 100,
  });
};

const closeModal = () => {
  resetForm();
  togglePageModal(false);
};

const createNewPage = async () => {
  if (!meta.value.valid) return;

  addCategory({
    name: pageName?.value || '',
    type: pageType.value.value,
    parentCategoryId: parentPage.value?.id || null,
  });

  closeModal();
};

const onSubmit = handleSubmit(createNewPage);
</script>
