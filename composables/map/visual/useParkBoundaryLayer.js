import { ref } from 'vue';

/**
 * 國家公園圖層 composable（可共用互動與樣式邏輯）
 * @param {Ref} map - Leaflet 地圖實例
 * @param {Function} emit - 給外部使用的 emit 方法
 * @param {Object} options - 額外設定：邊界顏色、hover、tooltip
 */
export function useParkBoundaryLayer(map, emit, options = {}) {
  const defaultColor = options.defaultBorderColor || '#1C202E';
  const fadedColor = options.fadedBorderColor || '#BCC2CC';
  const enableHover = options.enableHover !== false;
  const enableTooltip = options.enableTooltip !== false;

  const parkLayer = ref(null);
  const selectedPark = ref(null);
  const dataByPark = ref({});

  /**
   * 根據 level 回傳深色（預設 & 選中）顏色
   */
  const getPrimaryColorFromLevel = (level) => {
    switch (level) {
      case 'high':
        return '#FCA2AC';
      case 'mid':
        return '#FFE482';
      case 'low':
        return '#ADF0E3';
      default:
        return '#DCDFE5';
    }
  };

  /**
   * 根據 level 回傳淺色（非選中）顏色
   */
  const getFadedColorFromLevel = (level) => {
    switch (level) {
      case 'high':
        return '#FCB6BD';
      case 'mid':
        return '#FFEA9E';
      case 'low':
        return '#B8F2D1';
      default:
        return '#E9ECF2';
    }
  };

  const loadParkBoundaries = async (geojson, onClick = () => {}) => {
    parkLayer.value = L.geoJSON(geojson, {
      style: feature => getFeatureStyle(feature),
      onEachFeature: (feature, layer) => {
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
      }
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
      fillColor: isInitial || isSelected
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
    layer.bringToFront();
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
    const name = feature.properties.Name;
    selectedPark.value = name;

    highlightSelectedPark();
    emit?.('select-park', name);
    mapStore.setTaiwanFaded(true);
    callback(name);
  };

  /**
   * 將選中縣市高亮，其他變淺
   */
  const highlightSelectedPark = () => {
    parkLayer.value.eachLayer(layer => {
      const name = layer.feature.properties.Name;
      const isSelected = name === selectedPark.value;
      const parkData = dataByPark.value[name];
      const level = parkData?.level;

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
   * 重置選取狀態，回到初始狀態
   */
  const resetParkSelection = () => {
    selectedPark.value = null;

    parkLayer.value.eachLayer(layer => {
      const feature = layer.feature;
      const style = getFeatureStyle(feature);
      layer.setStyle(style);
    });

    mapStore.setTaiwanFaded(false);
  };

  return {
    loadParkBoundaries,
    dataByPark,
    selectedPark,
    highlightSelectedPark,
    resetParkSelection
  };
}
