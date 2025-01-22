import type { LocaleObject } from '@nuxtjs/i18n';
import {RobotForStaticPage, UseRobotReturn, UseRobotState} from "./types";


export const useRobots: UseRobotReturn = () => {
  const state = useState<UseRobotState>(`useRobots`, () => ({
    loading: false,
  }));


  /**
   * @description Function for setting robot for static page.
   * @returns CategoriesPageMeta
   * @example
   * ``` ts
   * setRobotForStaticPage()
   * ```
   */
  const setRobotForStaticPage: RobotForStaticPage = (staticPageName: string = '') => {
    state.value.loading = true;

    console.log(staticPageName);

    useHead({
      meta: [{ name: 'robots', content: 'added robot for static' }],
    });


    state.value.loading = false;
  };

  return {
    setRobotForStaticPage,
    ...toRefs(state.value),
  };
};
