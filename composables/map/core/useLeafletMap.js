export function useLeafletMap() {
  const map = ref(null);
  const isMapReady = ref(false);

  const createMap = async (elementId = 'map') => {
    await nextTick();

    const L = await import('leaflet');
    await import('leaflet/dist/leaflet.css');
    await import('leaflet.markercluster/dist/MarkerCluster.css');
    await import('leaflet.markercluster/dist/MarkerCluster.Default.css');
    await import('leaflet.markercluster');

    const container = L.DomUtil.get(elementId);

    if (!container) {
      console.warn(`[useLeafletMap] 找不到 map container #${elementId}`);
      return;
    }

    // 若已經初始化過，先移除原本的 map
    if (container._leaflet_id) {
      const oldMap = container._leaflet_map;
      if (oldMap && typeof oldMap.remove === 'function') {
        oldMap.off();
        oldMap.remove();
      }
      container._leaflet_id = null;
      container._leaflet_map = null;
      container.innerHTML = '';
    }

    const leafletMap = L.map(elementId, {
      center: [24.5, 121],
      zoom: 7,
      minZoom: 7,
      maxZoom: 18,
      zoomControl: false
    });

    container._leaflet_map = leafletMap;

    L.tileLayer(
      // 'https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png',
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      { attribution: '&copy; OpenStreetMap contributors' }
    ).addTo(leafletMap);

    L.control.zoom({ position: 'bottomleft' }).addTo(leafletMap);
    leafletMap.setMaxBounds([
      [22.0, 119.3],
      [25.5, 122.0]
    ]);

    map.value = leafletMap;
    isMapReady.value = true;

    setTimeout(() => leafletMap.invalidateSize(), 0);
    leafletMap.on('zoomend', () => leafletMap.invalidateSize());
  };

  const destroyMap = () => {
    if (map.value) {
      map.value.off();
      const container = map.value.getContainer?.();
      map.value.remove();
      if (container) container.innerHTML = '';
      map.value = null;
      isMapReady.value = false;
    }
  };

  return {
    map,
    isMapReady,
    createMap,
    destroyMap
  };
}
