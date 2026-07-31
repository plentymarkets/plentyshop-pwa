export interface HandleLogoutOptions {
  logout: () => Promise<void>;
  toggle: () => void;
}
