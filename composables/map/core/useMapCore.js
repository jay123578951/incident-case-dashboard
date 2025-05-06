import { useLeafletMap } from './useLeafletMap';

/**
 * 初始化地圖核心流程
 */
export function useMapCore({ emit }) {
  const { map, isMapReady, createMap, destroyMap } = useLeafletMap();

  /**
   * 地圖初始化主流程
   * @param {Object} options
   * @param {string} options.selectedArea - 初始區域名稱
   * @param {Function} [options.setupAllClusters] - 初始化所有 cluster 群組
   * @param {Function} [options.flyToTown] - 飛到指定區域
   * @param {Function} [options.loadMarkersInBounds] - 載入當前範圍內的標記
   * @param {Function} [options.registerEvents] - 註冊事件
   */
  const initializeMap = async ({
    selectedArea,
    setupAllClusters,
    flyToTown,
    loadMarkersInBounds,
    registerEvents
  }) => {
    await createMap();
    await setupAllClusters?.();
    if (selectedArea && flyToTown) {
      await flyToTown(selectedArea);
    }
    await loadMarkersInBounds?.();

    registerEvents?.();
  };

  return {
    map,
    isMapReady,
    initializeMap,
    destroyMap
  };
}
