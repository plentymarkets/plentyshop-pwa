import { Loader } from '@googlemaps/js-api-loader';

export const usePackstationMap = ({ apiKey, options }: UsePackstationMapOptions) => {
  const mapElement = ref<HTMLElement | null>(null);
  const map = shallowRef<google.maps.Map | null>(null);

  const initMap = async () => {
    if (!apiKey.value || map.value || !mapElement.value) return;

    const loader = new Loader({
      apiKey: apiKey.value,
      libraries: ['marker'],
    });

    try {
      await loader.load();
      map.value = new google.maps.Map(mapElement.value, options);
    } catch (error) {
      console.error('Error loading Google Maps API:', error);
    }
  };

  onUnmounted(() => {
    if (map.value) map.value = null;
  });

  watchEffect(() => {
    if (apiKey.value && !map.value && mapElement.value) initMap();
  });

  return {
    mapElement,
    map,
    initMap,
  };
};
