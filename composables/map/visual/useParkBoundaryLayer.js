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

  const getPrimaryColor = () => '#8BC4B7';
  const getFadedColor = () => '#C6ECE3';

  const loadParkBoundaries = async (geojson, onClick = () => {}) => {
    parkLayer.value = L.geoJSON(geojson, {
      style: feature => getFeatureStyle(feature),
      onEachFeature: (feature, layer) => {
        const name = feature.properties.NAME;
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
          click: () => handleClick(feature, layer, onClick)
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

  const getFeatureStyle = (feature) => {
    const name = feature.properties.NAME;
    const isSelected = selectedPark.value === name;
    const isInitial = !selectedPark.value;

    return {
      fillColor: isInitial || isSelected ? getPrimaryColor() : getFadedColor(),
      fillOpacity: isSelected || isInitial ? 0.6 : 0.2,
      weight: isSelected ? 2 : 1,
      color: isInitial || isSelected ? defaultColor : fadedColor
    };
  };

  const handleHover = (layer) => {
    layer.setStyle({
      weight: 2,
      color: defaultColor,
      dashArray: '',
      fillOpacity: 0.9
    });
    layer.bringToFront();
  };

  const resetHover = (layer, feature) => {
    const style = getFeatureStyle(feature);
    layer.setStyle(style);
  };

  const handleClick = async (feature, layer, callback) => {
    const name = feature.properties.NAME;
    selectedPark.value = name;
    highlightSelected();
    emit?.('select-park', name);
    callback(name);
  };

  const highlightSelected = () => {
    parkLayer.value.eachLayer(layer => {
      const name = layer.feature.properties.NAME;
      const isSelected = name === selectedPark.value;
      layer.setStyle({
        fillOpacity: isSelected ? 0.6 : 0.2,
        fillColor: isSelected ? getPrimaryColor() : getFadedColor(),
        weight: isSelected ? 2 : 1,
        color: isSelected ? defaultColor : fadedColor
      });
    });
  };

  const resetParkSelection = () => {
    selectedPark.value = null;
    parkLayer.value.eachLayer(layer => {
      const style = getFeatureStyle(layer.feature);
      layer.setStyle(style);
    });
  };

  return {
    loadParkBoundaries,
    dataByPark,
    selectedPark,
    highlightSelected,
    resetParkSelection
  };
}
