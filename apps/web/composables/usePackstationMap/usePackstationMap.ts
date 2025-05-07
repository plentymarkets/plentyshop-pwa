import type { Packstation } from '@plentymarkets/shop-api';

export const usePackstationMap = () => {
  const mapElement = ref<HTMLElement | null>(null);
  const packstationRefs = ref<(HTMLElement | null)[]>([]);
  const map = ref<google.maps.Map | null>(null);
  const realMarkers = ref<google.maps.Marker[]>([]);
  const previousMarker = ref<google.maps.Marker | null>(null);
  const currentPackstationIndex = ref<number | null>(null);

  const { data } = usePackstationFinder();

  const gmapsApiKey = computed(() => data.value.preferredProfilesData.gmapsApiKey);

  const loadGoogleMaps = async () => {
    if (!window.google?.maps) {
      await new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${gmapsApiKey.value}&libraries=marker`;
        script.async = true;
        script.defer = true;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    }
  };

  const showPackstationDetails = (index: number, marker: unknown) => {
    if (previousMarker.value) previousMarker.value.setAnimation(null);

    currentPackstationIndex.value = index;

    if (marker instanceof google.maps.Marker) {
      marker.setAnimation(google.maps.Animation.BOUNCE);
      map.value?.setCenter(marker.getPosition()!);
      map.value?.setZoom(16);
      previousMarker.value = marker;
    }

    if (packstationRefs.value[index]) {
      packstationRefs.value[index].scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const mapMarkers = computed(() => {
    return data.value.packstations.map((packstation: Packstation, index: number) => {
      const keyword = packstation.location.keyword;

      const svgMarker = {
        path: 'M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0zM192 272c44.183 0 80-35.817 80-80s-35.817-80-80-80-80 35.817-80 80 35.817 80 80 80z',
        fillColor: keyword === 'Packstation' ? '#ef4444' : '#3b82f6',
        fillOpacity: 1,
        strokeColor: '#ffffff',
        strokeWeight: 1,
        rotation: 0,
        scale: 0.06,
        anchor: new google.maps.Point(0, 20),
      };

      return {
        index,
        icon: svgMarker,
        packstation,
        position: {
          lat: Number(packstation.place.geo.latitude),
          lng: Number(packstation.place.geo.longitude),
        },
      };
    });
  });

  const initMap = async () => {
    if (!mapElement.value) return;

    const [{ Map }, { Marker }] = await Promise.all([
      google.maps.importLibrary('maps') as Promise<{ Map: typeof google.maps.Map }>,
      google.maps.importLibrary('marker') as Promise<{ Marker: typeof google.maps.Marker }>,
    ]);

    const bounds = new google.maps.LatLngBounds();

    map.value = new Map(mapElement.value!, {
      center: mapMarkers.value[0]?.position,
      zoom: 12,
      disableDefaultUI: true,
      zoomControl: true,
      streetViewControl: false,
      mapTypeControl: false,
      fullscreenControl: true,
    });

    realMarkers.value = [];

    mapMarkers.value.forEach((markerData) => {
      const marker = new Marker({
        position: markerData.position,
        map: map.value!,
        icon: markerData.icon,
      });

      realMarkers.value.push(marker);

      marker.addListener('click', () => {
        showPackstationDetails(markerData.index, marker);
      });

      marker.addListener('mouseover', () => {
        if (currentPackstationIndex.value === null) {
          marker.setAnimation(google.maps.Animation.BOUNCE);
        }
      });

      marker.addListener('mouseout', () => {
        if (currentPackstationIndex.value === null) {
          marker.setAnimation(null);
        }
      });

      bounds.extend(marker.getPosition()!);
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
