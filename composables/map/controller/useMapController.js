import { useMapCore } from '@/composables/map/core/useMapCore';
import { useMapLayers } from '@/composables/map/core/useMapLayers';
import { useMapMarkers } from '@/composables/map/core/useMapMarkers';
import { useLazyMarkers } from '@/composables/map/data/shared/useLazyMarkers';
import { useMarkerFocus } from '@/composables/map/interaction/useMarkerFocus';
import { useMapVisualController } from '@/composables/map/visual/useMapVisualController';
import { useMapEvents } from '@/composables/map/core/useMapEvents';
import { useFilterStore } from '@/stores/filter-store';

/**
 * 地圖總調度中心
 * 負責整合地圖各個模組，並提供外部調用接口
 * @param {Function} useMapCore - 地圖初始化
 * @param {Function} useMapLayers - 圖層管理
 * @param {Function} useMapMarkers - Marker 管理
 * @param {Function} useLazyMarkers - Lazy 加載
 * @param {Function} useMarkerFocus - 點擊聚焦
 * @param {Function} useMapVisualController - 視覺切換
 * @param {Function} useMapEvents - 地圖事件
 */
export function useMapController(props, emit) {
  // 地圖初始化核心流程（建立地圖、註冊 click 等）
  const { map, isMapReady, initializeMap, destroyMap } = useMapCore({ emit });

  // Layer 與 Marker 管理模組（管理 marker 實體與 cluster）
  const mapLayers = useMapLayers(map, isMapReady);
  const mapMarkers = useMapMarkers(map, isMapReady, emit, mapLayers);
  const {
    clearAllMarkers,
    setTempMarker,
    setupMarkerCluster,
    getClusterGroup,
    markerClusters
  } = mapMarkers;

  // 篩選條件來源
  const filterStore = useFilterStore();
  const { getActiveTypes } = storeToRefs(filterStore);

  // Props 傳入的 GeoJSON（已過濾）
  const filteredMarkers = computed(() => props.markerData);
  const allHydrantTypes = computed(() => ['地上式單口式', '地下式單口式']);

  // 懶加載 marker 資料（依地圖視野）
  const { loadMarkersInBounds, forceReload } = useLazyMarkers({
    map,
    isMapReady,
    markerData: filteredMarkers,
    mapMarkers,
    markerClusters,
    visibleTypes: getActiveTypes,
    allTypes: allHydrantTypes
  });

  // 根據 ID 聚焦某個 marker（載入後打開 popup）
  const { focusMarkerById } = useMarkerFocus(
    map,
    isMapReady,
    mapLayers.getLayer,
    loadMarkersInBounds
  );

  // 控制視覺層（圓圈、鄉鎮、polygons）
  const { flyToTown } = useMapVisualController({
    map,
    isMapReady,
    markers: filteredMarkers,
    markerClusters
  });

  // 註冊互動事件（例如 click 加標記點）
  const { registerEvents } = useMapEvents(map, isMapReady, emit, {
    enableClick: true
  });

  /**
   * 地圖初始化（包括地圖建立、載入 cluster、設定初始視角）
   */
  const initMap = async () => {
    if (!props.markerData?.features?.length) return;

    await initializeMap({
      selectedArea: props.selectedArea,
      setupAllClusters: () => {
        allHydrantTypes.value.forEach(setupMarkerCluster);
      },
      flyToTown,
      loadMarkersInBounds,
      registerEvents
    });
  };

  // 提供對外操作 API
  return {
    map,
    isMapReady,
    initMap,
    destroyMap,
    clearAllMarkers,
    forceReload,
    loadMarkersInBounds,
    setTempMarker,
    focusMarkerById,
    flyToTown,
    getClusterGroup,
    markerClusters
  };
}
