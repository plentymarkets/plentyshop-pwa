import { UseHomepageDataReturn, UseHomepageDataState, HomeData } from './types';

export const useHomePageState: UseHomepageDataReturn = () => {
  const state = useState<UseHomepageDataState>(`useHomepageState`, () => ({
    data: [] as HomeData[],
    loading: false,
    showErrors: false,
  }));


  const fieldData = state.value.data;

  const checkData = () => {
    console.log(fieldData);
  };

  return {
    fieldData,
    checkData,
    ...toRefs(state.value),
  };
};
