export type PaginationProps = {
  currentPage: number;
  currentPageName?: string;
  pageSize: number;
  totalItems: number;
  maxVisiblePages: number;
  disabled?: boolean;
};
