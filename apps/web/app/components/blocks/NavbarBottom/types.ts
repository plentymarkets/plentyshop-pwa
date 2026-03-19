type NavbarItemId = 'home' | 'products' | 'wishlist' | 'cart' | 'account';

export type NavbarItem = {
  id: NavbarItemId;
  label: string;
  icon: unknown;
  link: string;
};
