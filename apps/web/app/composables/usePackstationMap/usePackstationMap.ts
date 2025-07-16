import type { Packstation } from '@plentymarkets/shop-api';

export const usePackstationMap = () => {
  const state = useState('usePackstationMap', () => ({
    mapElement: null as HTMLElement | null,
    packstationRefs: [] as (HTMLElement | null)[],
    map: null as google.maps.Map | null,
    mapsLoaded: false,
    realMarkers: [] as google.maps.Marker[],
    previousMarker: null as google.maps.Marker | null,
    currentPackstationIndex: null as number | null,
  }));

  const { data } = usePackstationFinder();

  const gmapsApiKey = computed(() => data.value?.preferredProfilesData?.gmapsApiKey || '');

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
    scale: 0.052,
    anchor: new google.maps.Point(0, 20),
  });

  const showPackstationDetails = (index: number, marker: unknown) => {
    state.value.previousMarker?.setAnimation(null);
    state.value.currentPackstationIndex = index;

    if (marker instanceof google.maps.Marker) {
      marker.setAnimation(google.maps.Animation.BOUNCE);
      const markerPosition = marker.getPosition();
      if (markerPosition) {
        state.value.map?.setCenter(markerPosition);
        state.value.map?.setZoom(16);
      }
      state.value.previousMarker = marker;
    }

    const targetRef = state.value.packstationRefs[index];
    if (targetRef) targetRef.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const mapMarkers = computed(() => {
    if (!data.value?.packstations?.length) return [];
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

  const resetComponent = () => {
    state.value.realMarkers.forEach((marker) => {
      google.maps.event.clearInstanceListeners(marker);
      marker.setMap(null);
    });

    state.value.packstationRefs = [] as (HTMLElement | null)[];
    state.value.map = null as google.maps.Map | null;
    state.value.realMarkers = [] as google.maps.Marker[];
    state.value.previousMarker = null as google.maps.Marker | null;
  };

  const initMap = async () => {
    if (!state.value.mapElement || !mapMarkers.value.length) return;

    resetComponent();

    const [{ Map }, { Marker }] = await Promise.all([
      google.maps.importLibrary('maps') as Promise<{ Map: typeof google.maps.Map }>,
      google.maps.importLibrary('marker') as Promise<{ Marker: typeof google.maps.Marker }>,
    ]);

    const bounds = new google.maps.LatLngBounds();

    state.value.map = new Map(state.value.mapElement, {
      center: mapMarkers.value[0]?.position || { lat: 0, lng: 0 },
      zoom: 12,
      disableDefaultUI: true,
      zoomControl: true,
      streetViewControl: false,
      mapTypeControl: false,
      fullscreenControl: true,
    });

    state.value.realMarkers = mapMarkers.value.map((markerData) => {
      const marker = new Marker({
        position: markerData.position,
        map: state.value.map!,
        icon: markerData.icon,
      });

      marker.addListener('click', () => showPackstationDetails(markerData.index, marker));
      marker.addListener('mouseover', () => {
        if (state.value.currentPackstationIndex === null) marker.setAnimation(google.maps.Animation.BOUNCE);
      });
      marker.addListener('mouseout', () => {
        if (state.value.currentPackstationIndex === null) marker.setAnimation(null);
      });

      const pos = marker.getPosition();
      if (pos) bounds.extend(pos);

      return marker;
    });

    state.value.map.fitBounds(bounds);
  };

  watch(
    () => data.value?.packstations,
    async (list) => {
      if (list?.length) {
        state.value.currentPackstationIndex = null;
        await loadGoogleMaps();
        await nextTick();
        await initMap();
      }
    },
    { immediate: true },
  );

  onUnmounted(resetComponent);

  return {
    resetComponent,
    showPackstationDetails,
    ...toRefs(state.value),
  };
};
