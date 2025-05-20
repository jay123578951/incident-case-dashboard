import { ref } from 'vue';

/**
 * 台灣縣市邊界圖層管理 composable
 * @param {Ref} map - Leaflet 地圖實例
 * @param {Function} emit - 給外部使用的 emit 方法
 * @returns Object 控制函式
 */
export function useCountyBoundaryLayer(map, emit, options = {}) {
  const defaultColor = options.defaultBorderColor || '#666D80';
  const fadedColor = options.fadedBorderColor || '#BCC2CC';
  const enableHover = options.enableHover !== false;
  const enableTooltip = options.enableTooltip !== false;
  const setupTaiwanFaded = options.setupTaiwanFaded || false;
  const selectedOutlineLayer = ref(null);

  const borderWeight = 1;
  const selectedBorderWeight = 2;

  const countyLayer = ref(null);
  const selectedCounty = ref(null);
  const dataByCounty = ref({}); // 可外部設值

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

  /**
   * 畫出台灣縣市邊界
   */
  const loadCountyBoundaries = async (geojson, onCountyClick = () => {}) => {
    countyLayer.value = L.geoJSON(geojson, {
      style: (feature) => getFeatureStyle(feature),
      onEachFeature: (feature, layer) => {
        const name = feature.properties.COUNTYNAME;
        const countyData = dataByCounty.value[name];
        const value = countyData?.value ?? 0;

        if (enableTooltip) {
          layer.bindTooltip(`${name}：${value} 件`, {
            direction: 'top',
            sticky: true,
            offset: [0, -4],
            opacity: 1,
            className: 'county-tooltip'
          });
        }

        const handlers = {
          click: () => handleCountyClick(feature, layer, onCountyClick)
        };

        if (enableHover) {
          handlers.mouseover = () => handleHover(layer);
          handlers.mouseout = () => resetHover(layer, feature);
        }

        layer.on(handlers);
      }
    });

    countyLayer.value.addTo(map.value);
  };

  /**
   * 根據資料與選擇狀態決定樣式
   */
  const mapStore = useMapStore();
  const getFeatureStyle = (feature) => {
    const name = feature.properties.COUNTYNAME;
    const countyData = dataByCounty.value[name];
    const level = countyData?.level;
    const isSelected = selectedCounty.value === name;
    const isInitial = !selectedCounty.value;

    // isTaiwanFaded = true 已點擊各山域機關數據統計年度的縣市
    // setupTaiwanFaded = true 可以設定當點擊時台灣地圖底圖顏色
    // 套用統一的淡色樣式
    if (mapStore.isTaiwanFaded && setupTaiwanFaded) {
      return {
        fillColor: '#F1F4F9',
        fillOpacity: 1,
        weight: 1,
        color: '#E4E8EE'
      };
    }

    return {
      fillColor:
        isInitial || isSelected
          ? getPrimaryColorFromLevel(level)
          : getFadedColorFromLevel(level),
      fillOpacity: isInitial || isSelected ? 1 : 0.3,
      weight: isSelected ? selectedBorderWeight : borderWeight,
      color: isInitial || isSelected ? defaultColor : fadedColor
    };
  };

  /**
   * 滑鼠移入高亮
   */
  const handleHover = (layer) => {
    const name = layer.feature.properties.COUNTYNAME;
    if (name !== selectedCounty.value) {
      layer.setStyle({
        weight: borderWeight,
        color: defaultColor,
        dashArray: '',
        fillOpacity: 1
      });
    }
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
  const handleCountyClick = async (feature, layer, callback) => {
    clearSelectedOutline();

    const name = feature.properties.COUNTYNAME;
    selectedCounty.value = name;

    highlightSelectedCounty();
    drawSelectedOutline(feature);
    emit?.('select-county', name);
    callback(name);
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

    // 綁定為 group，方便移除
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
   * 將選中縣市高亮，其他變淺
   */
  const highlightSelectedCounty = () => {
    countyLayer.value.eachLayer((layer) => {
      const name = layer.feature.properties.COUNTYNAME;
      const isSelected = name === selectedCounty.value;
      const countyData = dataByCounty.value[name];
      const level = countyData?.level;

      layer.setStyle({
        fillOpacity: isSelected ? 0.8 : 0.3,
        fillColor: isSelected
          ? getPrimaryColorFromLevel(level)
          : getFadedColorFromLevel(level),
        weight: isSelected ? selectedBorderWeight : borderWeight,
        color: isSelected ? defaultColor : fadedColor
      });
    });
  };

  /**
   * 重置選取狀態，回到初始狀態
   */
  const resetCountySelection = () => {
    selectedCounty.value = null;

    if (selectedOutlineLayer.value) {
      map.value.removeLayer(selectedOutlineLayer.value);
      selectedOutlineLayer.value = null;
    }

    countyLayer.value.eachLayer((layer) => {
      const feature = layer.feature;
      const style = getFeatureStyle(feature);
      layer.setStyle(style);
    });
  };

  /**
   * 更新所有縣市樣式
   */
  const updateAllCountyStyles = () => {
    countyLayer.value.eachLayer((layer) => {
      const feature = layer.feature;
      const style = getFeatureStyle(feature);
      layer.setStyle(style);
    });
  };

  return {
    loadCountyBoundaries,
    dataByCounty,
    selectedCounty,
    highlightSelectedCounty,
    resetCountySelection,
    updateAllCountyStyles
  };
}
