import { UseHomepageDataReturn, UseHomepageDataState, HomeData } from './types';
import { toRefs } from 'vue';

export const useHomePageState: UseHomepageDataReturn = () => {
  const state = useState<UseHomepageDataState>(`useHomepageState`, () => ({
    data: [] as HomeData[],
    loading: false,
    showErrors: false,
  }));

  const fieldData = ref([]);

  return {
    ...toRefs(state.value),
    fieldData: fieldData,
  };
};
