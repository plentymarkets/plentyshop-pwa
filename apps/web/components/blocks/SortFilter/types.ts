export type SortFilterProps = {
  name: string;
  type: string;
  configuration?: object;
  index?: number;
  meta: {
    uuid: string;
  };
  shouldLoad?: boolean;
};
