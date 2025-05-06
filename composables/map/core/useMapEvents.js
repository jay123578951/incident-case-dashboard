/**
 * 地圖事件管理
 * @param {Object} options
 * @param {Ref} options.map - Leaflet 地圖實例
 * @param {Ref<boolean>} options.isMapReady - 地圖是否就緒
 * @param {Function} options.emit - Vue 的 emit 函數
 * @param {Object} options - 其他選項
 */
export function useMapEvents(map, isMapReady, emit, options = {}) {
  const { enableClick = true, onClick = null } = options;

  const registerEvents = () => {
    if (!map.value || !isMapReady.value) return;

    // 移除舊事件避免重複綁定
    map.value.off('click');

    if (enableClick) {
      map.value.on('click', (e) => {
        // 如果有外部處理函式就優先用
        if (typeof onClick === 'function') {
          onClick(e);
        } else {
          emit('mapClick', e.latlng);
        }
      });
    }
  };

  return {
    registerEvents
  };
}
