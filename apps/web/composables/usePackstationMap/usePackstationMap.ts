import type { Packstation } from '@plentymarkets/shop-api';

export const usePackstationMap = () => {
  const mapElement = ref<HTMLElement | null>(null);
  const packstationRefs = ref<(HTMLElement | null)[]>([]);
  const map = ref<google.maps.Map | null>(null);
  const realMarkers = ref<google.maps.Marker[]>([]);
  const previousMarker = ref<google.maps.Marker | null>(null);
  const currentPackstationIndex = ref<number | null>(null);

  const state = useState('usePackstationMap', () => ({
    mapsLoaded: false,
  }));

  const { data } = usePackstationFinder();

  const gmapsApiKey = computed(() => data.value.preferredProfilesData.gmapsApiKey);

  const loadGoogleMaps = async () => {
    if (state.value.mapsLoaded || window.google?.maps || !gmapsApiKey.value) return;

    state.value.mapsLoaded = true;

    await new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${gmapsApiKey.value}&libraries=marker`;
      script.async = true;
      script.defer = true;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  };

  const getMarkerIcon = (keyword: string): google.maps.Symbol => ({
    path: 'M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0zM192 272c44.183 0 80-35.817 80-80s-35.817-80-80-80-80 35.817-80 80 35.817 80 80 80z',
    fillColor: keyword === 'Packstation' ? '#ef4444' : '#3b82f6',
    fillOpacity: 1,
    strokeColor: '#ffffff',
    strokeWeight: 1,
    rotation: 0,
    scale: 0.06,
    anchor: new google.maps.Point(0, 20),
  });

  const showPackstationDetails = (index: number, marker: unknown) => {
    if (previousMarker.value) {
      previousMarker.value.setAnimation(null);
    }

    currentPackstationIndex.value = index;

    if (marker instanceof google.maps.Marker) {
      marker.setAnimation(google.maps.Animation.BOUNCE);
      const markerPosition = marker.getPosition();
      if (markerPosition) {
        map.value?.setCenter(markerPosition);
        map.value?.setZoom(16);
      }
      previousMarker.value = marker;
    }

    const targetRef = packstationRefs.value[index];
    if (targetRef) targetRef.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const mapMarkers = computed(() => {
    return data.value.packstations.map((packstation: Packstation, index: number) => ({
      index,
      icon: getMarkerIcon(packstation.location.keyword),
      packstation,
      position: {
        lat: Number(packstation.place.geo.latitude),
        lng: Number(packstation.place.geo.longitude),
      },
    }));
  });

  const initMap = async () => {
    if (!mapElement.value) return;

    const [{ Map }, { Marker }] = await Promise.all([
      google.maps.importLibrary('maps') as Promise<{ Map: typeof google.maps.Map }>,
      google.maps.importLibrary('marker') as Promise<{ Marker: typeof google.maps.Marker }>,
    ]);

    realMarkers.value.forEach((m) => m.setMap(null));
    realMarkers.value = [];

    const bounds = new google.maps.LatLngBounds();

    map.value = new Map(mapElement.value, {
      center: mapMarkers.value[0]?.position,
      zoom: 12,
      disableDefaultUI: true,
      zoomControl: true,
      streetViewControl: false,
      mapTypeControl: false,
      fullscreenControl: true,
    });

    mapMarkers.value.forEach((markerData) => {
      const marker = new Marker({
        position: markerData.position,
        map: map.value!,
        icon: markerData.icon,
      });

      realMarkers.value.push(marker);

      marker.addListener('click', () => showPackstationDetails(markerData.index, marker));
      marker.addListener('mouseover', () => {
        if (currentPackstationIndex.value === null) marker.setAnimation(google.maps.Animation.BOUNCE);
      });
      marker.addListener('mouseout', () => {
        if (currentPackstationIndex.value === null) marker.setAnimation(null);
      });

      const pos = marker.getPosition();
      if (pos) bounds.extend(pos);
    });

    map.value.fitBounds(bounds);
  };

  watch(
    () => data.value.packstations,
    async (list) => {
      if (list.length) {
        currentPackstationIndex.value = null;
        await loadGoogleMaps();
        await nextTick();
        await initMap();
      }
    },
    { immediate: true },
  );

  return {
    mapElement,
    packstationRefs,
    realMarkers,
    mapMarkers,
    currentPackstationIndex,
    showPackstationDetails,
  };
};
