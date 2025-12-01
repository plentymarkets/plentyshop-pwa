export interface LazyContentDrawerProps {
  categoryid: number;
  title?: string;
  visible?: boolean;
}

export interface LazyContentState {
  content: string;
  loading: boolean;
  error: string;
  hasLoaded: boolean;
  isClient: boolean;
}
