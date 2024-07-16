export type SaveAddressButtonProps = {
  isLoading: boolean;
  save: () => Promise<boolean | boolean[]>;
};
