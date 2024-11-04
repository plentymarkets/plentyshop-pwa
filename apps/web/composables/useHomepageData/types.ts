
export interface UseHomepageDataState {
  data: null;
  loading: boolean;
  showErrors: boolean;
}

export interface UseHomepageData {
  data: Readonly<Ref<UseHomepageDataState>>;
  loading: boolean;
  showErrors: boolean;
}
export type DoHomepageData = () => UseHomepageDataState;

export type UseHomepageDataReturn = () => UseHomepageData;
