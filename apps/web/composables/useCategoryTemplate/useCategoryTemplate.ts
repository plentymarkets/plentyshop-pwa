import {
  UseCategoryTemplate,
  UseCategoryTemplateReturn,
  UseCategoryTemplateState,
} from '~/composables/useCategoryTemplate/types';

export const useCategoryTemplate: UseCategoryTemplateReturn = () => {
  const state = useState<UseCategoryTemplateState>('useCategoryTemplate', () => ({
    data: null,
    loading: false,
  }));

  const runtimeConfig = useRuntimeConfig();

  // const fetchCategoryTemplate: FetchCategoryTemplate = async () => {
  //   state.value.loading = true;
  //
  //   return await useSdk().plentysystems.getCategoryTemplate(runtimeConfig.public.homepageCategory)
  //     // .then(({ data }) => {
  //     //   state.value.data = data ?? state.value.data;
  //     //   state.value.loading = false;
  //     //   return state.value.data;
  //     // });
  // };

  return {
    fetchCategoryTemplate,
    ...toRefs(state.value),
  };
};
