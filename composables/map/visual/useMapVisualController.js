import { watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useMapViewStore } from '@/stores/map-view-store';
import { useTownBoundaries } from '@/composables/map/data/town/useTownBoundaries';
import { useMapCircles } from '@/composables/map/visual/useMapCircles';

/**
 * 管理地圖上視覺層的開關邏輯
 * @param {Object} options
 * @param {Ref} options.map - Leaflet map 實例
 * @param {Ref} options.isMapReady - 地圖是否初始化完成
 * @param {Array} options.markers - 當前顯示的 marker 資料（用於圈圈）
 * @param {Object} options.markerClusters - 群集物件 Map<type, clusterGroup>
 */
export function useMapVisualController({
  map,
  isMapReady,
  markers,
  markerClusters
}) {
  const mapViewStore = useMapViewStore();
  const { showTown, showCircles, showPolygons } = storeToRefs(mapViewStore);

  // 鄉鎮邊界控制
  const {
    loadTownBoundaries,
    showTownBoundaries,
    hideTownBoundaries,
    flyToTown
  } = useTownBoundaries(map, isMapReady);

  // 圓圈控制
  const { addCircle, updateCircles, clearCircles } = useMapCircles({
    map,
    markers,
    visibleCircles: showCircles,
    markerClusters
  });

  // === 自動同步 store <-> map 視覺狀態 ===

  watch(showTown, (val) => {
    if (!isMapReady.value) return;
    val ? showTownBoundaries() : hideTownBoundaries();
  });

  watch(
    showCircles,
    (val) => {
      if (!isMapReady.value) return;
      if (val) updateCircles();
      else clearCircles();
    },
    { immediate: true }
  );

  // 預留多邊形控制
  watch(showPolygons, (val) => {
    // TODO: 實作 polygon 顯示控制
  });

  return {
    flyToTown, // 提供對外控制
    updateCircles, // 若外部資料更新需要重新畫圓
    clearCircles,
    loadTownBoundaries,
    showTownBoundaries,
    hideTownBoundaries
  };
}
