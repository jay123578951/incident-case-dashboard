import { LayerTypes } from '@/utils/constants/mapIcons';

/**
 * 提供根據 ID 聚焦到特定 Marker 的功能
 */
export const useMarkerFocus = (
  map,
  isMapReady,
  getLayer,
  loadMarkersInBounds
) => {
  const waitForMarkerLayer = async (id, maxTries = 10, delay = 100) => {
    for (let i = 0; i < maxTries; i++) {
      const layer = getLayer(id);
      if (layer?.type === LayerTypes.MARKER && layer.instance) {
        return layer.instance;
      }
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
    return null;
  };

  const focusMarkerById = async (id, geoJSON) => {
    if (!map.value || !isMapReady.value || !id || !geoJSON?.features) return;

    const found = geoJSON.features.find((f) => f.properties?.id === id);
    if (!found) {
      console.warn(`[focusMarkerById] 找不到 ID 為 ${id} 的 marker`);
      return;
    }

    const latlng = [
      found.geometry.coordinates[1],
      found.geometry.coordinates[0]
    ];
    map.value.setView(latlng, 18);

    // 檢查是否已經存在該 marker，沒找到才強制載入
    const existing = getLayer(id);
    if (!existing || !map.value.hasLayer(existing.instance)) {
      await loadMarkersInBounds?.();
    }

    const instance = await waitForMarkerLayer(id);
    if (instance && found.properties) {
      instance.openPopup?.();
    } else {
      console.warn(`[focusMarkerById] 無法在地圖上找到 ID: ${id} 的標記`);
    }
  };

  return { focusMarkerById };
};
