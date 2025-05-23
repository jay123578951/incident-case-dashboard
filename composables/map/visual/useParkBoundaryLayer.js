import { ref } from 'vue';

/**
 * 國家公園圖層 composable（可共用互動與樣式邏輯）
 * @param {Ref} map - Leaflet 地圖實例
 * @param {Function} emit - 給外部使用的 emit 方法
 * @param {Object} options - 額外設定：邊界顏色、hover、tooltip
 */
export function useParkBoundaryLayer(map, emit, options = {}) {
  const defaultColor = options.defaultBorderColor || '#666D80';
  const fadedColor = options.fadedBorderColor || '#BCC2CC';
  const enableHover = options.enableHover !== false;
  const enableTooltip = options.enableTooltip !== false;
  const selectedOutlineLayer = ref(null);

  const parkLayer = ref(null);
  const selectedPark = ref(null);
  const dataByPark = ref({});

  const primaryColorMap = {
    high: '#FCA2AC',
    mid: '#FFE482',
    low: '#ADF0E3'
  };

  const fadedColorMap = {
    high: '#FCB6BD',
    mid: '#FFEA9E',
    low: '#B8F2D1'
  };

  const getPrimaryColorFromLevel = (level) =>
    primaryColorMap[level] || '#DCDFE5'; // 根據 level 回傳深色（預設 & 選中）顏色
  const getFadedColorFromLevel = (level) => fadedColorMap[level] || '#E9ECF2'; // 根據 level 回傳淺色（非選中）顏色

  /**
   * 設置國家公園圖層的樣式與事件
   */
  const setupFeatureLayer = (feature, layer, onClick) => {
    const name = feature.properties.Name;
    const parkData = dataByPark.value[name];
    const value = parkData?.value ?? 0;

    if (enableTooltip) {
      layer.bindTooltip(`${name}：${value} 件`, {
        direction: 'top',
        sticky: true,
        offset: [0, -4],
        opacity: 1,
        className: 'park-tooltip'
      });
    }

    const handlers = {
      click: () => handleParkClick(feature, layer, onClick)
    };

    if (enableHover) {
      handlers.mouseover = () => handleHover(layer);
      handlers.mouseout = () => resetHover(layer, feature);
    }

    layer.on(handlers);
  };

  /**
   * 載入國家公園邊界
   */
  const loadParkBoundaries = async (geojson, onClick = () => {}) => {
    if (parkLayer.value) {
      map.value.removeLayer(parkLayer.value);
    }

    parkLayer.value = L.geoJSON(geojson, {
      style: (feature) => getFeatureStyle(feature),
      onEachFeature: (feature, layer) =>
        setupFeatureLayer(feature, layer, onClick)
    });

    parkLayer.value.addTo(map.value);
  };

  /**
   * 根據資料與選擇狀態決定樣式
   */
  const getFeatureStyle = (feature) => {
    const name = feature.properties.Name;
    const parkData = dataByPark.value[name];
    const level = parkData?.level;
    const isSelected = selectedPark.value === name;
    const isInitial = !selectedPark.value;

    return {
      fillColor:
        isInitial || isSelected
          ? getPrimaryColorFromLevel(level)
          : getFadedColorFromLevel(level),
      fillOpacity: isInitial || isSelected ? 1 : 0.3,
      weight: isSelected ? 2 : 1,
      color: isInitial || isSelected ? defaultColor : fadedColor
    };
  };

  /**
   * 滑鼠移入高亮
   */
  const handleHover = (layer) => {
    layer.setStyle({
      weight: 2,
      color: defaultColor,
      dashArray: '',
      fillOpacity: 1
    });
  };

  /**
   * 滑鼠移出還原樣式
   */
  const resetHover = (layer, feature) => {
    const style = getFeatureStyle(feature);
    layer.setStyle(style);
  };

  /**
   * 點擊縣市事件
   */
  const mapStore = useMapStore();
  const handleParkClick = async (feature, layer, callback) => {
    resetSelectedPark();
    clearSelectedOutline();

    selectPark(feature.properties.Name);

    drawSelectedOutline(feature);
    emit?.('select-park', feature.properties.Name);
    mapStore.setTaiwanFaded(true);
    callback(feature.properties.Name);
  };

  /**
   * 選中縣市
   */
  const selectPark = (name) => {
    selectedPark.value = name;
    updateSelectedParkStyle();
  };

  /**
   * 更新選中縣市的樣式
   */
  const updateSelectedParkStyle = () => {
    parkLayer.value.eachLayer((layer) => {
      const name = layer.feature.properties.Name;
      const isSelected = name === selectedPark.value;
      const parkData = dataByPark.value[name];
      const level = parkData?.level;

      layer.setStyle({});
      layer.setStyle({
        fillOpacity: isSelected ? 0.8 : 0.3,
        fillColor: isSelected
          ? getPrimaryColorFromLevel(level)
          : getFadedColorFromLevel(level),
        weight: isSelected ? 2 : 1,
        color: isSelected ? defaultColor : fadedColor
      });
    });
  };

  /**
   * 畫出選中縣市的外框
   */
  const drawSelectedOutline = async (feature) => {
    const L = window.L || (await import('leaflet'));

    // 清除前一次
    if (selectedOutlineLayer.value) {
      map.value.removeLayer(selectedOutlineLayer.value);
    }

    // 陰影底層
    const shadow = L.geoJSON(feature.geometry, {
      style: {
        color: '#999',
        weight: 5,
        opacity: 0.6,
        fill: false
      }
    }).addTo(map.value);

    // 上層白邊
    const outline = L.geoJSON(feature.geometry, {
      style: {
        color: '#fff',
        weight: 2,
        opacity: 1,
        fill: false
      }
    }).addTo(map.value);

    // 綁定為 group
    selectedOutlineLayer.value = L.layerGroup([shadow, outline]).addTo(
      map.value
    );
  };

  /**
   * 清除選中縣市的外框
   */
  const clearSelectedOutline = () => {
    if (selectedOutlineLayer.value) {
      map.value.removeLayer(selectedOutlineLayer.value);
      selectedOutlineLayer.value = null;
    }
  };

  /**
   * 重置選取狀態，回到初始狀態
   */
  const resetSelectedPark = () => {
    selectedPark.value = null;

    clearSelectedOutline();

    parkLayer.value.eachLayer((layer) => {
      const style = getFeatureStyle(layer.feature);
      layer.setStyle(style);
    });

    mapStore.setTaiwanFaded(false);
  };

  return {
    loadParkBoundaries,
    dataByPark,
    selectedPark,
    // highlightSelectedPark,
    resetSelectedPark
  };
}
