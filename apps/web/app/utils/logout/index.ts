import type { HandleLogoutOptions } from './types';

export const handleLogout = async ({ logout, toggle }: HandleLogoutOptions) => {
  toggle();
  await logout();
  globalThis.location.reload();
};
