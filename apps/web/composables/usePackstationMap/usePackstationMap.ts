export const usePackstationMap = ({ apiKey }: UsePackstationMapOptions) => {
  const initMap = async () => {
    if (!apiKey.value) return;
  };

  return {
    initMap,
  };
};
