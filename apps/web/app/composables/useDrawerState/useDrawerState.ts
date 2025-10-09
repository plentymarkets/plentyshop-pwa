export const useDrawerState = () => {
  const isDrawerOpen = useState('isDrawerOpen', () => false);

  const setDrawerOpen = (isOpen: boolean) => {
    isDrawerOpen.value = isOpen;
  };

  return { isDrawerOpen, setDrawerOpen };
};
