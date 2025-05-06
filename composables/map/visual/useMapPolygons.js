import * as turf from '@turf/turf';
import { debounce } from 'lodash';

export function useMapPolygons({
  mapRef, // 地圖實例的 ref
  markersRef, // 標記數據的 ref（包含 category 屬性）
  visibleRangesRef // 控制範圍顯示的 ref（可選，類似 visibleCircles）
}) {
  const rangePolygons = ref(new Map());
  const isPolygonsVisible = visibleRangesRef;

  const categoryColorMap = {
    category1: '#ff0000',
    category2: '#00ff00',
    category3: '#0000ff',
    default: '#888888'
  };

  /**
   * 根據類別返回顏色
   * @param {string} category - 類別
   * @returns {string} - 顏色
   */
  const getCategoryColor = (category) =>
    categoryColorMap[category] || categoryColorMap.default;

  /**
   * 清除所有範圍多邊形
   */
  const clearRanges = () => {
    for (const polygon of rangePolygons.value.values()) {
      mapRef.value?.hasLayer(polygon) && mapRef.value.removeLayer(polygon);
    }
    rangePolygons.value.clear();
  };

  /**
   * 按類別分組標記並計算凸包範圍
   * @param {Array} markers - 標記數據
   * @returns {Map} - 按類別分組的標記
   */
  const groupMarkersByCategory = (markers) => {
    const grouped = new Map();
    const isGeoJSON = markers?.type === 'FeatureCollection';
    const features = isGeoJSON ? markers.features : markers;

    for (const marker of features) {
      const category = isGeoJSON ? marker.properties.category : marker.category;
      const categoryKey = category || 'default';

      if (!grouped.has(categoryKey)) grouped.set(categoryKey, []);

      const markerData = isGeoJSON
        ? {
            lat: marker.geometry.coordinates[1],
            lng: marker.geometry.coordinates[0],
            category: category
          }
        : marker;

      grouped.get(categoryKey).push(markerData);
    }
    return grouped;
  };

  /**
   * 按 category 分組標記並計算範圍
   */
  const updateRanges = () => {
    try {
      if (!mapRef.value || !isPolygonsVisible.value) {
        clearRanges();
        return;
      }

      // 清除現有範圍多邊形
      clearRanges();

      // 按 category 分組標記
      const markers = markersRef || [];
      const groupedMarkers = groupMarkersByCategory(markers);

      // 為每個類別計算凸包並繪製多邊形
      for (const [category, group] of groupedMarkers) {
        if (group.length < 3) continue;

        const coords = group.map(({ lat, lng }) => [lng, lat]);

        const convexHull = turf.convex(
          turf.featureCollection(coords.map((coord) => turf.point(coord)))
        );

        if (!convexHull) continue;

        const polygonCoords = convexHull.geometry.coordinates[0].map(
          ([lng, lat]) => [lat, lng]
        );

        const polygon = L.polygon(polygonCoords, {
          color: getCategoryColor(category),
          weight: 2,
          opacity: 0.8,
          fillOpacity: 0.2
        }).addTo(mapRef.value);

        rangePolygons.value.set(category, polygon);
      }
    } catch (error) {
      console.warn('Failed to update ranges:', error);
    }
  };

  /**
   * 防抖更新範圍
   */
  const debouncedUpdateRanges = debounce(updateRanges, 300);

  /**
   * 移除地圖事件監聽器
   */
  const removeMapListeners = () => {
    if (mapRef.value) {
      mapRef.value.off('moveend', debouncedUpdateRanges);
      mapRef.value.off('zoomend', debouncedUpdateRanges);
    }
  };

  /**
   * 添加地圖事件監聽器
   */
  const addMapListeners = () => {
    if (mapRef.value) {
      mapRef.value.on('moveend', debouncedUpdateRanges);
      mapRef.value.on('zoomend', debouncedUpdateRanges);
      debouncedUpdateRanges();
    }
  };

  /**
   * 監聽 markersRef 變化
   */
  watch(() => markersRef, debouncedUpdateRanges, { deep: true });

  /**
   * 監聽 isPolygonsVisible 變化
   */
  watch(isPolygonsVisible, (visible) => {
    visible ? debouncedUpdateRanges() : clearRanges();
  });

  /**
   * 監聽地圖縮放/移動事件，動態更新範圍
   */
  watch(
    () => mapRef.value,
    (newMap, oldMap) => {
      if (oldMap) removeMapListeners();
      if (newMap) addMapListeners();
    },
    { immediate: true }
  );

  /**
   * 清理
   */
  onUnmounted(() => {
    clearRanges();
    removeMapListeners();
  });

  return {
    rangePolygons,
    isPolygonsVisible,
    updateRanges,
    clearRanges
  };
}
