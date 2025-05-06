import { debounce } from 'lodash.debounce';

export function useMapInteraction({
  map,
  markerCluster,
  visibleCircles,
  circlesMap,
  updateCircles,
  clearCircles
}) {
  let isUserInteracting = false;
  const isListening = ref(false);

  /**
   * 隱藏所有圓圈
   */
  const hideAllCircles = (mapInstance) => {
    for (const { instance } of circlesMap.value.values()) {
      if (mapInstance.hasLayer(instance)) {
        mapInstance.removeLayer(instance);
      }
    }
  };

  /**
   * 綁定地圖互動事件
   */
  const bindMapInteractionEvents = (mapInstance, onCleanup) => {
    const onInteractionStart = () => {
      isUserInteracting = true;
      hideAllCircles(mapInstance);
    };

    const debouncedUpdateCircles = debounce(() => {
      isUserInteracting = false;
      if (visibleCircles.value) {
        updateCircles();
      }
    }, 300);

    mapInstance.on('movestart', onInteractionStart);
    mapInstance.on('zoomstart', onInteractionStart);
    mapInstance.on('moveend', debouncedUpdateCircles);
    mapInstance.on('zoomend', debouncedUpdateCircles);

    onCleanup(() => {
      mapInstance.off('movestart', onInteractionStart);
      mapInstance.off('zoomstart', onInteractionStart);
      mapInstance.off('moveend', debouncedUpdateCircles);
      mapInstance.off('zoomend', debouncedUpdateCircles);
    });
  };

  /**
   * 綁定 Cluster 事件
   */
  const bindClusterEvents = (cluster, onCleanup) => {
    const onClusterAnimationEnd = () => {
      if (!isUserInteracting && visibleCircles.value) {
        console.log('Cluster animation ended, updating circles');
        updateCircles();
      }
    };

    cluster.on('animationend', onClusterAnimationEnd);

    onCleanup(() => {
      cluster.off('animationend', onClusterAnimationEnd);
    });
  };

  /**
   * 啟用監聽
   */
  const startListening = () => {
    if (isListening.value || !map.value || !markerCluster.value) {
      console.warn('Cannot start listening: Map or markerCluster not ready');
      return;
    }

    isListening.value = true;

    // 綁定事件，並在 visibleCircles 變化時清理
    const stopMapWatch = watch(
      () => map.value,
      (newMap, _, onCleanup) => {
        if (!newMap) return;
        bindMapInteractionEvents(newMap, onCleanup);
      },
      { immediate: true }
    );

    const stopClusterWatch = watch(
      () => markerCluster.value,
      (cluster, _, onCleanup) => {
        if (!cluster) return;
        bindClusterEvents(cluster, onCleanup);
      },
      { immediate: true }
    );

    // 當 visibleCircles 為 false 時停止監聽
    const stopVisibleCirclesWatch = watch(visibleCircles, (visible) => {
      if (!visible && isListening.value) {
        stopListening();
      }
    });

    // 返回清理函數
    return () => {
      stopMapWatch();
      stopClusterWatch();
      stopVisibleCirclesWatch();
      clearCircles();

      isListening.value = false;
    };
  };

  /**
   * 停止監聽
   */
  const stopListening = () => {
    if (!isListening.value) return;
    // 清理邏輯由 watch 的 onCleanup 自動處理
    isListening.value = false;
  };

  /**
   * 僅在 visibleCircles 為 true 時啟動監聽
   */
  watch(
    () => visibleCircles?.value,
    (visible) => {
      if (visible && !isListening.value) {
        startListening();
      } else if (!visible && isListening.value) {
        stopListening();
      }
    },
    { immediate: true }
  );

  return {
    isListening,
    startListening,
    stopListening
  };
}
