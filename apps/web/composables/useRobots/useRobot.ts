import { GetRobots, SetRobotForStaticPage, UseRobotReturn, UseRobotState } from './types';
import { robotGetters, RobotsStaticPages } from '@plentymarkets/shop-api';

export const useRobots: UseRobotReturn = () => {
  const state = useState<UseRobotState>(`useRobots`, () => ({
    loading: false,
    data: {} as RobotsStaticPages,
  }));

  /**
   *
   */
  const getRobots: () => Promise<any> = async () => {
    state.value.loading = true;
    const { data, error } = await useAsyncData(() => useSdk().plentysystems.getRobots());
    useHandleError(error.value);

    state.value.data = data.value?.data ?? state.value.data;
    state.value.loading = false;
    return state.value.data;
  };

  /**
   * @description Function for setting robot for static page.
   * @returns CategoriesPageMeta
   * @example
   * ``` ts
   * setRobotForStaticPage()
   * ```
   */
  const setRobotForStaticPage: SetRobotForStaticPage = (staticPageName: string = '') => {
    state.value.loading = true;

    let content = 'ALL';
    switch (staticPageName) {
      case 'Homepage':
        content = robotGetters.getRobotsHomepage(state.value.data);
        break;

      case 'ContactPage':
        content = robotGetters.getRobotsContactPage(state.value.data);
        break;

      case 'CancellationRights':
        content = robotGetters.getRobotsCancellationRights(state.value.data);
        break;

      case 'CancellationForm':
        content = robotGetters.getRobotsCancellationForm(state.value.data);
        break;

      case 'LegalDisclosure':
        content = robotGetters.getRobotsLegalDisclosure(state.value.data);
        break;

      case 'PrivacyPolicy':
        content = robotGetters.getRobotsPrivacyPolicy(state.value.data);
        break;

      case 'TermsAndConditions':
        content = robotGetters.getRobotsTermsAndConditions(state.value.data);
        break;

      case 'SearchResult':
        content = robotGetters.getRobotsSearchResult(state.value.data);
        break;
    }

    useHead({
      meta: [{ name: 'robots', content: content }],
    });

    state.value.loading = false;
  };

  return {
    getRobots,
    setRobotForStaticPage,
    ...toRefs(state.value),
  };
};
