import { LayerTypes } from '@/utils/constants/mapIcons';

/**
 * 管理圖層的模組
 */
export const useMapLayers = (map, isMapReady) => {
  const layers = reactive(new Map());
  const debug = false;

  const VALID_LAYER_TYPES = Object.values(LayerTypes);

  /**
   * 加入圖層（例如 marker、polygon、鄉鎮邊界等）
   * @param {Object} layerData
   * @param {string} layerData.id - 圖層唯一 ID
   * @param {string} layerData.type - 圖層類型（LayerTypes.MARKER 等）
   * @param {Object} layerData.instance - Leaflet 圖層實例（marker / polygon 等）
   * @param {Object} [layerData.options] - 額外選項
   * @param {boolean} [layerData.skipAddToMap=false] - 是否略過自動加到地圖（若由 cluster group 控制，應設為 true）
   */
  const addLayer = ({
    id,
    type,
    instance,
    options = {},
    skipAddToMap = false
  }) => {
    if (!id || !type || !instance || typeof instance.addTo !== 'function') {
      console.warn('[addLayer] 無效參數:', { id, type, instance });
      return;
    }

    if (!VALID_LAYER_TYPES.includes(type)) {
      console.warn(`[addLayer] 不支援的圖層類型: ${type}`);
    }

    if (layers.has(id)) {
      console.warn(`[addLayer] 圖層已存在: ${id}`);
      return;
    }

    layers.set(id, { id, type, instance, options });

    // 若 skipAddToMap 為 true，表示此圖層已由 cluster group 或其他外層控制顯示
    if (!skipAddToMap && map.value && isMapReady.value) {
      instance.addTo(map.value);
      if (debug) console.debug(`[MapLayers] 已加入圖層: ${id}`);
    }
  };

  /**
   * 取得圖層物件
   * @param {string} id
   * @returns {Layer|undefined}
   */
  const getLayer = (id) => layers.get(id);

  /**
   * 是否存在圖層 ID
   */
  const hasLayer = (id) => layers.has(id);

  /**
   * 根據類型切換顯示
   */
  const toggleLayerType = (targetType, visible = true) => {
    for (const layer of layers.values()) {
      if (layer.type === targetType && layer.instance) {
        visible
          ? layer.instance.addTo(map.value)
          : map.value.removeLayer(layer.instance);
      }
    }
  };

  /**
   * 移除指定圖層
   */
  const removeLayer = (id) => {
    const layer = layers.get(id);
    if (layer?.instance && map.value?.hasLayer(layer.instance)) {
      map.value.removeLayer(layer.instance);
      if (debug) console.debug(`[MapLayers] 已移除圖層: ${id}`);
    }
    layers.delete(id);
  };

  /**
   * 清除所有圖層
   */
  const clearAllLayers = () => {
    for (const { instance } of layers.values()) {
      if (map.value?.hasLayer(instance)) {
        map.value.removeLayer(instance);
      }
    }
    layers.clear();
    if (debug) console.debug('[MapLayers] 所有圖層已清除');
  };

  /**
   * 回傳目前所有圖層資訊（除錯用）
   */
  const listLayers = () => Array.from(layers.values());

  return {
    addLayer,
    getLayer,
    hasLayer,
    toggleLayerType,
    removeLayer,
    clearAllLayers,
    listLayers
  };
};
