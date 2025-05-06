/**
 * 集中管理地圖初始化與銷毀的生命週期控制
 * @param {Object} props - 組件傳入的 props
 * @param {Object} mapController - 提供地圖控制函式與狀態的物件
 */
export function useMapLifecycle(props, mapController) {
  const { initMap, destroyMap, clearAllMarkers, forceReload, isMapReady } =
    mapController;

  // Modal 狀態切換時控制地圖初始化/銷毀
  const watchModalOpen = () => {
    watch(
      () => props.isModalOpen,
      async (open) => {
        if (open && props.markerData?.features?.length) {
          await initMap();
          if (isMapReady.value) forceReload();
        } else {
          clearAllMarkers();
          destroyMap();
        }
      },
      { immediate: true }
    );
  };

  // Marker 資料變動時初始化地圖（非 modal 狀態）
  const watchMarkerData = () => {
    watch(
      () => props.markerData,
      async (data) => {
        if (!props.isModalOpen && data?.features?.length && !isMapReady.value) {
          await initMap();
        }
        if (isMapReady.value) forceReload();
      },
      { immediate: true, deep: true }
    );
  };

  return {
    watchModalOpen,
    watchMarkerData
  };
}
