import { ref } from 'vue';

/**
 * 台灣縣市邊界圖層管理 composable
 * @param {Ref} map - Leaflet 地圖實例
 * @param {Function} emit - 給外部使用的 emit 方法
 * @returns Object 控制函式
 */
export function useCountyBoundaryLayer(map, emit) {
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
  const loadCountyBoundaries = async (onCountyClick = () => {}) => {
    const res = await fetch('/geoJSON/twCounty2010.geo.json');
    const geojson = await res.json();

    countyLayer.value = L.geoJSON(geojson, {
      style: feature => getFeatureStyle(feature),
      onEachFeature: (feature, layer) => {
        const name = feature.properties.COUNTYNAME;
        const countyData = dataByCounty.value[name];
        const value = countyData?.value ?? 0;

        layer.bindTooltip(`${name}：${value} 件`, {
          direction: 'top',
          sticky: true,
          offset: [0, -4],
          opacity: 1,
          className: 'county-tooltip'
        });

        layer.on({
          click: () => handleCountyClick(feature, layer, onCountyClick),
          mouseover: () => handleHover(layer),
          mouseout: () => resetHover(layer, feature)
        });
      }
    });

    countyLayer.value.addTo(map.value);
  };

  /**
   * 根據資料與選擇狀態決定樣式
   */
  const getFeatureStyle = (feature) => {
    const name = feature.properties.COUNTYNAME;
    const countyData = dataByCounty.value[name];
    const level = countyData?.level;
    const isSelected = selectedCounty.value === name;
    const isInitial = !selectedCounty.value;

    return {
      fillColor: isInitial || isSelected
        ? getPrimaryColorFromLevel(level)
        : getFadedColorFromLevel(level),
      fillOpacity: isSelected || isInitial ? 0.8 : 0.3,
      color: '#333',
      weight: isSelected ? 3 : 1
    };
  };

  /**
   * 滑鼠移入高亮
   */
  const handleHover = (layer) => {
    layer.setStyle({
      weight: 3,
      color: '#000',
      dashArray: '',
      fillOpacity: 0.9
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
  const handleCountyClick = async (feature, layer, callback) => {
    const name = feature.properties.COUNTYNAME;
    selectedCounty.value = name;

    highlightSelectedCounty();
    emit?.('select-county', name);
    callback(name);
  };

  /**
   * 重置選取狀態，回到初始狀態
   */
  const resetCountySelection = () => {
    selectedCounty.value = null;

    countyLayer.value.eachLayer(layer => {
      const feature = layer.feature;
      const style = getFeatureStyle(feature);
      layer.setStyle(style);
    });
  };

  /**
   * 將選中縣市高亮，其他變淺
   */
  const highlightSelectedCounty = () => {
    countyLayer.value.eachLayer(layer => {
      const name = layer.feature.properties.COUNTYNAME;
      const isSelected = name === selectedCounty.value;
      const countyData = dataByCounty.value[name];
      const level = countyData?.level;

      layer.setStyle({
        fillOpacity: isSelected ? 0.8 : 0.3,
        fillColor: isSelected
          ? getPrimaryColorFromLevel(level)
          : getFadedColorFromLevel(level),
        weight: isSelected ? 3 : 1,
        color: '#333'
      });
    });
  };

  return {
    loadCountyBoundaries,
    resetCountySelection,
    dataByCounty,
    selectedCounty,
    highlightSelectedCounty
  };
}