/**
 * 提供鄉鎮邊界資料與顯示控制
 * 包含：載入 geojson、快取 bounds、加/移除圖層、飛到鄉鎮
 */
export function useTownBoundaries(map, isMapReady) {
  // 存放圖層實例（用 ref 避免 Proxy 問題）
  const townLayer = ref(null);

  // 儲存每個鄉鎮名稱對應的 bounds（供 flyTo 使用）
  const townBoundsMap = reactive({});

  // 資料載入狀態（避免重複請求）
  const isTownDataLoaded = ref(false);
  const isLoadingTownData = ref(false);

  /**
   * 載入鄉鎮邊界 GeoJSON，並建立圖層
   * - 會自動儲存每個鄉鎮的 bounds
   * - 設定點擊時可自動 flyTo
   */
  const loadTownBoundaries = async () => {
    // 若資料已載入、正在載入中、或地圖尚未準備 → 中止
    if (
      isTownDataLoaded.value ||
      isLoadingTownData.value ||
      !map.value ||
      !isMapReady.value
    )
      return;

    try {
      isLoadingTownData.value = true;

      const L = await import('leaflet'); // 動態載入 Leaflet
      const res = await fetch('/json/towns.json'); // 載入 GeoJSON
      const geojson = await res.json();

      // 建立圖層（canvas 渲染以提升效能）
      townLayer.value = L.geoJSON(geojson, {
        style: {
          color: '#2b83ba',
          weight: 1,
          fillOpacity: 0.1
        },
        renderer: L.canvas(),
        onEachFeature: (feature, layer) => {
          const name = feature.properties?.TOWNNAME?.trim();
          if (name) {
            // 快取鄉鎮名稱對應的 bounds
            townBoundsMap[name] = layer.getBounds();
            layer.bindPopup(name);
          }

          // 點擊邊界時自動 flyTo 該範圍
          layer.on('click', () => {
            const bounds = layer.getBounds();
            map.value.flyToBounds(bounds, {
              maxZoom: 18,
              duration: 0.5
            });
          });
        }
      });

      isTownDataLoaded.value = true;
    } catch (error) {
      console.error('載入鄉鎮界線失敗:', error);
      isTownDataLoaded.value = false;
    } finally {
      isLoadingTownData.value = false;
    }
  };

  /**
   * 確保資料已載入，若未載入則等待或觸發一次載入
   */
  const ensureTownDataLoaded = async () => {
    if (!isTownDataLoaded.value) {
      if (isLoadingTownData.value) {
        // 若已在載入中，就等待載入完成
        while (isLoadingTownData.value) {
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
      } else {
        await loadTownBoundaries();
      }
    }
  };

  /**
   * 顯示鄉鎮邊界圖層（若未載入則先載入）
   */
  const showTownBoundaries = async () => {
    if (!map.value || !isMapReady.value) return;

    await ensureTownDataLoaded();

    if (townLayer.value && !map.value.hasLayer(townLayer.value)) {
      map.value.addLayer(townLayer.value);
    }
  };

  /**
   * 隱藏鄉鎮邊界圖層
   */
  const hideTownBoundaries = async () => {
    if (!map.value || !isMapReady.value) return;

    if (townLayer.value && map.value.hasLayer(townLayer.value)) {
      map.value.removeLayer(townLayer.value);
    }
  };

  /**
   * 移動畫面到指定鄉鎮的中心點，並自動判斷縮放級距
   * @param {string} name - 鄉鎮名稱
   */
  const flyToTown = async (name) => {
    await ensureTownDataLoaded();

    const trimmedName = name?.trim();
    const bounds = townBoundsMap[trimmedName];
    if (!bounds || !map.value) {
      console.warn(`[flyToTown] 找不到範圍: ${trimmedName}`);
      return;
    }

    // 根據範圍大小決定 zoom 等級
    const distance = bounds.getNorthEast().distanceTo(bounds.getSouthWest());
    const zoomLevel = distance > 10000 ? 14 : distance > 5000 ? 15 : 16;

    return new Promise((resolve) => {
      map.value.flyTo(bounds.getCenter(), zoomLevel, { duration: 0.5 });
      map.value.once('moveend', resolve); // 等動畫結束
    });
  };

  // 對外暴露功能
  return {
    loadTownBoundaries,
    showTownBoundaries,
    hideTownBoundaries,
    flyToTown,
    townBoundsMap,
    isTownDataLoaded
  };
}
