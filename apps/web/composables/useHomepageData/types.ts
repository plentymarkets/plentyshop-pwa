import { HeroContentProps } from '~/components/ui/HeroCarousel/types';
import { MediaItemProps } from '~/components/ui/MediaCard/types';

interface HomeData {
  id: number;
  hero: HeroContentProps[];
  valueProposition: MediaItemProps[];
}

export interface UseHomepageDataState {
  data: HomeData[];
  loading: boolean;
  showErrors: boolean;
}

export type FormattedHeroItems = HeroContentProps[];
export type MediaData = MediaItemProps[];

export interface UseHomepageMethods {
  data: Readonly<Ref<UseHomepageDataState['data']>>;
  loading: Readonly<Ref<boolean>>;
  showErrors: Readonly<Ref<boolean>>;
  formattedHeroItems: FormattedHeroItems;
  mediaData: MediaData;
  recommendedProductsCategoryId: string;
}
export type DoHomepageData = () => UseHomepageDataState;

export type UseHomepageDataReturn = () => UseHomepageMethods;

// export interface UseAddressMethodsState {
//   data: Address[];
//   useAsShippingAddress: boolean;
//   loading: boolean;
//   defaultAddressId: number;
//   defaultAddress: Address;
//   cartAddressId: number;
//   cartAddress: Address;
//   displayAddress: Address;
// }

// export type GetAddresses = () => Promise<Address[]>;
// export type SaveAddress = (address: Address, combineShippingBilling?: boolean) => Promise<Address[]>;
// export type SetDefault = (address: Address) => void;
// export type SetCheckoutAddress = (typeId: AddressType, addressId: number) => void;
// export type DeleteAddress = (addressId: number) => Promise<Address[]>;
// export type SetDisplayAddress = (address: Address, setAsCheckoutAddress: boolean) => void;
// export interface UseAddressMethods {
//   data: Readonly<Ref<UseAddressMethodsState['data']>>;
//   loading: Readonly<Ref<boolean>>;
//   defaultAddressId: Readonly<Ref<number>>;
//   displayAddress: Readonly<Ref<Address>>;
//   useAsShippingAddress: Ref<boolean>;
//   getAddresses: GetAddresses;
//   saveAddress: SaveAddress;
//   setCheckoutAddress: SetCheckoutAddress;
//   setDefault: SetDefault;
//   deleteAddress: DeleteAddress;
//   setDisplayAddress: SetDisplayAddress;
//   hasDisplayAddress: ComputedRef<boolean>;
// }

// export type UseAddressReturn = (type: AddressType, cacheKey?: string) => UseAddressMethods;
