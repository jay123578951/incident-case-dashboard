export function useLeafletMap() {
  const map = ref(null);
  const isMapReady = ref(false);

  const createMap = async (elementId = 'map') => {
    await nextTick();

    const L = await import('leaflet');
    await import('leaflet/dist/leaflet.css');
    await import('leaflet.markercluster/dist/MarkerCluster.css');
    await import('leaflet.markercluster/dist/MarkerCluster.Default.css');
    await import('leaflet.markercluster');

    const container = L.DomUtil.get(elementId);

    if (!container) {
      console.warn(`[useLeafletMap] 找不到 map container #${elementId}`);
      return;
    }

    // 若 map 已經初始化過，先完整清除舊的實例與 DOM 標記
    if (container._leaflet_id) {
      const oldMap = container._leaflet_map;
      if (oldMap && typeof oldMap.remove === 'function') {
        oldMap.off(); // 移除所有事件監聽
        oldMap.remove(); // 從 DOM 移除
      }
      container._leaflet_id = null;
      container._leaflet_map = null;
      container.innerHTML = ''; // 清空內容
    }

    // 建立 Leaflet 地圖實例
    const leafletMap = L.map(elementId, {
      center: [24.5, 121],
      zoom: 7.4,             // 支援小數 zoom（更細膩）
      minZoom: 7,            // 可設定地圖可縮放最小級別
      maxZoom: 18,
      zoomControl: false,
      zoomSnap: 0,           // 允許非整數 zoom（可視需求加）
      zoomDelta: 0.25        // 缩放步長（配合自訂按鈕時好用）
    });

    // 記錄 map 實例於 container 上（避免重複建立）
    container._leaflet_map = leafletMap;

    // 若你仍有使用底圖，可保留；否則可註解掉以下行
    L.tileLayer(
      // 'https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png',
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      { attribution: '&copy; OpenStreetMap contributors' }
    ).addTo(leafletMap);

    // 加入縮放控制按鈕（如需）
    L.control.zoom({ position: 'bottomleft' }).addTo(leafletMap);

    // 設定地圖最大可移動範圍（限制在台灣上下左右）
    leafletMap.setMaxBounds([
      [22.0, 117.5],  // 南西界
      [26.5, 123.5]   // 北東界
    ]);
    leafletMap.options.maxBoundsViscosity = 1.0; // 彈性邊界黏性（拖到邊界時會反彈）

    map.value = leafletMap;
    isMapReady.value = true;

    // 延遲觸發 resize（避免初始渲染錯誤）
    setTimeout(() => leafletMap.invalidateSize(), 0);

    // 每次 zoom 完也觸發 resize，確保呈現正確
    leafletMap.on('zoomend', () => leafletMap.invalidateSize());
  };

  const destroyMap = () => {
    if (map.value) {
      map.value.off(); // 移除所有事件監聽
      const container = map.value.getContainer?.();
      map.value.remove(); // 從 DOM 拔除
      if (container) container.innerHTML = '';
      map.value = null;
      isMapReady.value = false;
    }
  };

  return {
    map,
    isMapReady,
    createMap,
    destroyMap
  };
}
