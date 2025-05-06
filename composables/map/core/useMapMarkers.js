import { useMarkerCluster } from '@/composables/map/visual/useMarkerCluster';
import { useTempMarker } from '@/composables/map/interaction/useTempMarker';
import { createMarkerFromFeature } from '@/utils/data-transform/marker';
import { createMapIcon } from '@/utils/custom-icons/factory';
import { LayerTypes } from '@/utils/constants/mapIcons';

/**
 * 管理 Marker 的模組
 * 負責管理 Marker 的建立、清除、更新等操作
 * @param {Function} useMarkerCluster - 管理 Marker Cluster 的模組
 * @param {Function} useTempMarker - 管理 Temp Marker 的模組
 * @param {Function} mapLayers - 管理 Layer 的模組
 */
export const useMapMarkers = (map, isMapReady, emit, mapLayers) => {
  const { addLayer, getLayer, clearAllLayers, removeLayer } = mapLayers;

  const { setupMarkerCluster, markerClusters, clearAllClusters } =
    useMarkerCluster(map, isMapReady);

  const { setTempMarker } = useTempMarker(map, emit);

  /**
   * icon 產生器
   */
  const iconFactory = (props) => {
    return createMapIcon(props.category || 'FIRE_HYDRANT', props);
  };

  /**
   * 新增 Markers 並回傳成功加入的 ID 陣列
   * @param {string} type - 群組類型，例如 'default' 或 '地上式單口式'
   * @param {Object} geoJsonData - GeoJSON 資料（FeatureCollection）
   * @returns {Array<string>} - 成功加入的 marker ID 陣列
   */
  const addMarkers = (
    type = 'default',
    geoJsonData = { type: 'FeatureCollection', features: [] }
  ) => {
    if (!window.L) {
      console.error('Leaflet 未載入');
      return [];
    }

    const addedIds = [];

    // 確保該類型的 cluster group 已建立
    const clusterGroup = setupMarkerCluster(type);

    geoJsonData.features.forEach((feature) => {
      const id = feature.properties?.id;
      if (!id) return;

      if (getLayer(id)) return;

      const marker = createMarkerFromFeature(feature, iconFactory);
      if (!marker) return;

      clusterGroup.addLayer(marker); // 直接加進 cluster group

      addLayer({
        id,
        type: LayerTypes.MARKER,
        instance: marker,
        skipAddToMap: true // 已交由 cluster group 控制
      });

      addedIds.push(id);
    });

    return addedIds;
  };

  /**
   * 清除所有 Markers
   */
  const clearAllMarkers = (type = null) => {
    if (type) {
      const group = markerClusters.get(type);
      if (group) group.clearLayers();
    } else {
      clearAllClusters();
      clearAllLayers();
    }
  };

  /**
   * 移除 clusterGroup 中不在指定 ID 清單內的 marker
   * @param {string} type - marker 類型 (對應 cluster group)
   * @param {Set<string>} shouldKeepIds - 要保留的 marker ID Set
   */
  const removeUnmatchedMarkersFromCluster = (type, shouldKeepIds) => {
    const clusterGroup = markerClusters.get(type);
    if (!clusterGroup) {
      console.warn(`[removeUnmatchedMarkersFromCluster] 找不到群組: ${type}`);
      return;
    }

    clusterGroup.eachLayer((marker) => {
      const id = marker.options?.id;
      if (!id || !shouldKeepIds.has(id)) {
        clusterGroup.removeLayer(marker);
        removeLayer(id); // 同步從 mapLayer 管理移除
      }
    });
  };

  return {
    setupMarkerCluster,
    addMarkers,
    clearAllMarkers,
    removeUnmatchedMarkersFromCluster,
    setTempMarker,
    getClusterGroup: (type) => markerClusters.get(type),
    markerClusters: readonly(markerClusters)
  };
};
