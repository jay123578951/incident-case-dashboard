import { useMapInteraction } from '@/composables/map/interaction/useMapInteraction';
import { LayerTypes } from '@/utils/constants/mapIcons';

export function useMapCircles({
  map, // 地圖實例
  markers, // 標記數據
  visibleCircles, // 控制圓圈顯示
  markerCluster // marker cluster
}) {
  const circlesMap = ref(new Map());

  /**
   * 新增圓圈
   * @param {Object} data - 圓圈數據
   * @param {Function} addLayer - 添加圖層的函數
   */
  const addCircle = (data, addLayer) => {
    // 檢查是否為 GeoJSON 格式
    const isGeoJSON = data.type === 'Feature';
    const circleData = isGeoJSON
      ? {
          id: data.properties.id,
          lat: data.geometry.coordinates[1],
          lng: data.geometry.coordinates[0],
          radius: data.properties.radius
        }
      : data;

    if (!map.value || !circleData.id || !circleData.radius) {
      // console.warn('無法新增 Circle', circleData);
      return;
    }

    const circle = window.L.circle([circleData.lat, circleData.lng], {
      radius: circleData.radius,
      color: '#3182ce',
      fillColor: '#90cdf4',
      fillOpacity: 0.2
    });

    // 儲存到 circlesMap
    circlesMap.value.set(circleData.id, {
      instance: circle,
      options: { radius: circleData.radius }
    });

    const circleId = `circle-${circleData.id}`;
    addLayer({
      id: circleId,
      type: LayerTypes.CIRCLE,
      instance: circle,
      options: { radius: circleData.radius, markerId: circleData.id }
    });

    // 根據 visibleCircles 決定是否顯示
    if (!visibleCircles.value && map.value.hasLayer(circle)) {
      map.value.removeLayer(circle);
    }
  };

  /**
   * 更新 Circles 顯示狀態
   */
  const updateCircles = () => {
    if (!map.value) return;

    try {
      // 檢查地圖容器大小是否發生變化，如果是則更新地圖
      map.value.invalidateSize();
    } catch (err) {
      console.warn('地圖尺寸無效:', err);
    }

    for (const [id, circleData] of circlesMap.value.entries()) {
      // 通過 ID 在 markerCluster 中查找對應的 Marker
      const marker = markerCluster.value
        .getLayers()
        .find((layer) => layer.options.id === id);

      if (!marker || !circleData) {
        console.log(`Circle 更新跳過: Marker ${id} 不存在`);
        continue;
      }

      try {
        const latlng = marker.getLatLng();
        // 將 Circles 的位置設置為與 Marker 相同的位置
        circleData.instance.setLatLng(latlng);
        // 設置 Circles 的半徑
        circleData.instance.setRadius(circleData.options.radius);

        // 檢查 marker 是否被叢集化
        const visibleParent = markerCluster.value.getVisibleParent(marker);
        // 如果 visibleParent 不是 marker 本身，則表示它被叢集化
        const isClustered = visibleParent !== marker;

        if (visibleCircles.value && !isClustered) {
          if (!map.value.hasLayer(circleData.instance)) {
            map.value.addLayer(circleData.instance);
          }
        } else {
          if (map.value.hasLayer(circleData.instance)) {
            map.value.removeLayer(circleData.instance);
          }
        }
      } catch (err) {
        console.warn(`Circle 更新錯誤 (id: ${id})`, err);
      }
    }
  };

  /**
   * 清空 Circles
   */
  const clearCircles = () => {
    for (const circleData of circlesMap.value.values()) {
      if (map.value?.hasLayer(circleData.instance)) {
        map.value.removeLayer(circleData.instance);
      }
    }
    circlesMap.value.clear();
  };

  /**
   * 使用 useMapInteraction 處理地圖事件
   */
  const { startListening, stopListening } = useMapInteraction({
    map,
    markerCluster,
    visibleCircles,
    circlesMap,
    updateCircles,
    clearCircles
  });

  /**
   * 監聽 markers 變化
   */
  watch(
    () => markers,
    () => updateCircles(),
    { deep: true }
  );

  /**
   * 組件卸載時清理
   */
  onUnmounted(() => {
    stopListening();
    clearCircles();
  });

  return {
    circlesMap,
    addCircle,
    updateCircles,
    clearCircles,
    startListening,
    stopListening
  };
}

// new
// import { ref, watch, onUnmounted } from 'vue';
// import { useMapInteraction } from '@/composables/map/interaction/useMapInteraction';
// import { LayerTypes } from '@/utils/types/layers';

// export function useMapCircles({ map, markers, visibleCircles, markerCluster }) {
//   const circlesMap = ref(new Map());

//   /**
//    * 建立單一 Circle
//    */
//   const addCircle = (data, addLayer) => {
//     if (!map.value) return;

//     const isGeoJSON = data.type === 'Feature';
//     const circleData = isGeoJSON
//       ? {
//           id: data.properties.id,
//           lat: data.geometry.coordinates[1],
//           lng: data.geometry.coordinates[0],
//           radius: data.properties.radius,
//         }
//       : data;

//     if (!circleData.id || !circleData.radius) {
//       console.warn('缺少必要的 Circle 資訊:', circleData);
//       return;
//     }

//     const circle = window.L.circle([circleData.lat, circleData.lng], {
//       radius: circleData.radius,
//       color: '#3182ce',
//       fillColor: '#90cdf4',
//       fillOpacity: 0.2,
//     });

//     circlesMap.value.set(circleData.id, {
//       instance: circle,
//       options: { radius: circleData.radius },
//     });

//     const circleId = `circle-${circleData.id}`;
//     addLayer?.({
//       id: circleId,
//       type: LayerTypes.CIRCLE,
//       instance: circle,
//       options: { radius: circleData.radius, markerId: circleData.id },
//     });

//     if (!visibleCircles.value && map.value.hasLayer(circle)) {
//       map.value.removeLayer(circle);
//     }
//   };

//   /**
//    * 更新所有 Circles 位置與顯示狀態
//    */
//   const updateCircles = () => {
//     if (!map.value || !markerCluster.value) return;

//     try {
//       map.value.invalidateSize();
//     } catch (err) {
//       console.warn('地圖尺寸更新失敗:', err);
//     }

//     const clusterLayers = markerCluster.value.getLayers();

//     for (const [id, { instance, options }] of circlesMap.value.entries()) {
//       const marker = clusterLayers.find((layer) => layer.options.id === id);
//       if (!marker) {
//         console.log(`找不到對應 Marker，跳過 Circle: ${id}`);
//         continue;
//       }

//       try {
//         const latlng = marker.getLatLng();
//         instance.setLatLng(latlng);
//         instance.setRadius(options.radius);

//         const isClustered = markerCluster.value.getVisibleParent(marker) !== marker;

//         if (visibleCircles.value && !isClustered) {
//           if (!map.value.hasLayer(instance)) map.value.addLayer(instance);
//         } else {
//           if (map.value.hasLayer(instance)) map.value.removeLayer(instance);
//         }
//       } catch (err) {
//         console.warn(`更新 Circle (${id}) 時錯誤:`, err);
//       }
//     }
//   };

//   /**
//    * 移除所有 Circles
//    */
//   const clearCircles = () => {
//     for (const { instance } of circlesMap.value.values()) {
//       if (map.value?.hasLayer(instance)) {
//         map.value.removeLayer(instance);
//       }
//     }
//     circlesMap.value.clear();
//   };

//   // 地圖互動：例如 zoom in/out 時，重新檢查哪些圓要顯示
//   const { startListening, stopListening } = useMapInteraction({
//     map,
//     markerCluster,
//     visibleCircles,
//     circlesMap,
//     updateCircles,
//     clearCircles,
//   });

//   watch(
//     () => markers,
//     () => {
//       updateCircles();
//     },
//     { deep: true }
//   );

//   onUnmounted(() => {
//     stopListening();
//     clearCircles();
//   });

//   return {
//     circlesMap,
//     addCircle,
//     updateCircles,
//     clearCircles,
//     startListening,
//     stopListening,
//   };
// }
