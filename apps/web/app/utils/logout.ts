interface HandleLogoutOptions {
  logout: () => Promise<void>;
  toggle: () => void;
}

export const handleLogout = async ({ logout, toggle }: HandleLogoutOptions) => {
  toggle();
  await logout();
  globalThis.location.reload();
};
