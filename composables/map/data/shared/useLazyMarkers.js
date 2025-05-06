import debounce from 'lodash.debounce';
import {
  getFeatures,
  extractMarkerData,
  convertMarkersToGeoJSON
} from '@/utils/data-transform/geo-json';

/**
 * 懶加載標記點 composable
 * 根據地圖的縮放與視野動態載入對應範圍的 markers，
 * 並使用 clusterGroup 進行顯示管理。
 *
 * @param {Object} options
 * @param {Ref} options.map - Leaflet map 實例（ref）
 * @param {Ref} options.isMapReady - 地圖是否就緒（ref）
 * @param {Ref} options.markerData - 來源資料（GeoJSON 形式）
 * @param {Object} options.mapMarkers - marker 管理工具（含 add/remove/cluster）
 * @param {Map} options.markerClusters - marker cluster group 集合
 * @param {Ref<Array<string>>} options.visibleTypes - 目前啟用的類型
 * @param {Ref<Array<string>>} options.allTypes - 所有 marker 類型
 * @returns {Object} 提供控制與狀態資訊
 */
export function useLazyMarkers({
  map,
  isMapReady,
  markerData,
  mapMarkers,
  markerClusters,
  visibleTypes,
  allTypes
}) {
  const markerCache = new Map(); // 快取：boundsKey -> type -> markers[]
  const activeKeys = new Set(); // 未來可用於做已載入範圍的追蹤（目前保留未用）
  const MIN_ZOOM_LEVEL = 12;

  const isZooming = ref(false);
  const isLoadingMarkers = ref(false);

  // 產生唯一的 bounds key，用來辨識目前地圖範圍
  const getBoundsKey = (bounds) => {
    const ne = bounds.getNorthEast();
    const sw = bounds.getSouthWest();
    const format = (v) => v.toFixed(2);
    return `${format(ne.lat)},${format(ne.lng)}-${format(sw.lat)},${format(sw.lng)}`;
  };

  // 根據目前視野範圍，篩出在其中的 marker 並依類型分類
  const fetchMarkersInBounds = async (bounds) => {
    const features = getFeatures(markerData.value);
    if (!features) return {};

    const groups = {};
    features.forEach((f) => {
      const { lat, lng, type, ...data } = extractMarkerData(f);
      if (!bounds.contains([lat, lng])) return;

      if (!groups[type]) groups[type] = [];

      // 此處建立原生 L.Marker（尚未透過 mapMarkers）
      const marker = L.marker([lat, lng], { type, ...data });
      groups[type].push(marker);
    });

    return groups; // { '地上式單口式': [marker1, marker2], ... }
  };

  // 清除目前所有 marker
  const clearMarkers = () => {
    mapMarkers.clearAllMarkers();
  };

  // 主邏輯：根據目前視野，載入符合條件的 cluster group markers
  const updateVisibleMarkers = async () => {
    if (!map.value || !isMapReady.value || !markerData?.value) return;
    if (isZooming.value) return;

    const zoom = map.value.getZoom();
    if (zoom < MIN_ZOOM_LEVEL) {
      // 避免 zoom 太遠載入太多資料
      clearMarkers();
      activeKeys.clear();
      return;
    }

    const bounds = map.value.getBounds().pad(0.2); // 加 padding 預先載入周邊
    const boundsKey = getBoundsKey(bounds);

    // 若已快取過，直接使用
    let groupMarkers = markerCache.get(boundsKey);
    if (!groupMarkers) {
      groupMarkers = await fetchMarkersInBounds(bounds);
      markerCache.set(boundsKey, groupMarkers);
    }

    // 載入啟用中的類型
    for (const type of visibleTypes.value ?? []) {
      const markers = groupMarkers[type] ?? [];
      const geoJson = convertMarkersToGeoJSON(markers);
      const newIds = new Set(geoJson.features.map((f) => f.properties.id));

      // 移除 cluster group 中不在這次列表內的 marker
      mapMarkers.removeUnmatchedMarkersFromCluster(type, newIds);

      // 找出還沒加入過的 marker
      const toAdd = geoJson.features.filter((f) => {
        const id = f.properties.id;
        const clusterGroup = markerClusters.get(type);
        return (
          id &&
          clusterGroup &&
          !clusterGroup
            .getLayers()
            .some((m) => m.feature?.properties?.id === id)
        );
      });

      // 加入 cluster group 中
      if (toAdd.length) {
        mapMarkers.addMarkers(type, {
          ...geoJson,
          features: toAdd
        });
      }
    }

    // 隱藏未啟用的群組
    const inactiveTypes =
      allTypes.value?.filter(
        (type) => !(visibleTypes.value ?? []).includes(type)
      ) ?? [];
    inactiveTypes.forEach((type) => {
      mapMarkers.removeUnmatchedMarkersFromCluster(type, new Set());
    });

    isLoadingMarkers.value = false;
  };

  // 防止 zoom/move 過快導致載入太頻繁
  const debouncedUpdate = debounce(() => {
    if (!isZooming.value && isMapReady.value) {
      updateVisibleMarkers();
    }
  }, 300);

  // zoom 過程暫停載入
  const onZoomStart = () => {
    isZooming.value = true;
  };
  const onZoomEnd = () => {
    isZooming.value = false;
    debouncedUpdate();
  };

  // 綁定地圖事件：縮放與拖曳都觸發更新
  watch(
    [map, isMapReady],
    ([m, ready], [oldMap]) => {
      if (oldMap) {
        oldMap.off('moveend', debouncedUpdate);
        oldMap.off('zoomstart', onZoomStart);
        oldMap.off('zoomend', onZoomEnd);
      }

      if (m && ready) {
        m.on('zoomstart', onZoomStart);
        m.on('zoomend', onZoomEnd);
        m.on('moveend', debouncedUpdate);
      }
    },
    { immediate: true }
  );

  // 離開組件時清掉事件監聽
  onUnmounted(() => {
    map.value?.off('moveend', debouncedUpdate);
    map.value?.off('zoomstart', onZoomStart);
    map.value?.off('zoomend', onZoomEnd);
  });

  /**
   * 手動觸發 reload（例如切換區域）
   */
  const forceReload = () => {
    markerCache.clear();
    activeKeys.clear();
    updateVisibleMarkers();
  };

  return {
    clearAllMarkers: () => {
      clearMarkers();
      markerCache.clear();
      activeKeys.clear();
    },
    loadMarkersInBounds: updateVisibleMarkers,
    forceReload,
    isLoadingMarkers
  };
}
