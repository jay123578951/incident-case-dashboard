export const useMarkerCluster = (map, isMapReady) => {
  const markerClusters = reactive(new Map());

  /**
   * 初始化 Marker Cluster
   */
  const setupMarkerCluster = (type) => {
    if (!map.value || !isMapReady.value || !window.L) {
      console.error('Leaflet 未載入或地圖尚未準備');
      return;
    }

    if (markerClusters.has(type)) return markerClusters.get(type);

    const clusterGroup = new window.L.markerClusterGroup({
      renderer: L.canvas(), // 切換到 Canvas 渲染
      disableClusteringAtZoom: 16, // 設置最大縮放級別禁用 Cluster
      animateAddingMarkers: false, // 禁用群組動畫
      animate: false // 禁用群組動畫
    });

    markerClusters.set(type, clusterGroup);
    map.value.addLayer(clusterGroup);

    return clusterGroup;
  };

  /**
   * 清除所有群組的 marker
   */
  const clearAllClusters = () => {
    for (const group of markerClusters.values()) {
      group.clearLayers();
    }
  };

  return {
    setupMarkerCluster,
    clearAllClusters,
    markerClusters
  };
};
