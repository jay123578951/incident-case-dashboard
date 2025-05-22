import { ref } from 'vue';
import { useMapStore } from '@/stores/useMapStore';

/**
 * 山域圖層 composable（可共用互動與樣式邏輯）
 * @param {Ref} map - Leaflet 地圖實例
 * @param {Function} emit - 給外部使用的 emit 方法
 * @param {Object} options - 額外設定：邊界顏色、hover、tooltip
 */
export function useMountainBoundaryLayer(map, emit, options = {}) {
  const defaultColor = options.defaultBorderColor || '#666D80';
  const fadedColor = options.fadedBorderColor || '#BCC2CC';
  const enableHover = options.enableHover !== false;
  const enableTooltip = options.enableTooltip !== false;
  const selectedOutlineLayer = ref(null);

  const mountainLayer = ref(null);
  const selectedMountain = ref(null);
  const dataByMountain = ref({});

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

  const getPrimaryColorFromLevel = (level) => primaryColorMap[level] || '#DCDFE5';
  const getFadedColorFromLevel = (level) => fadedColorMap[level] || '#E9ECF2';

  const setupFeatureLayer = (feature, layer, onClick) => {
    const name = feature.properties.WKNG_C;
    const mountainData = dataByMountain.value[name];
    const value = mountainData?.value ?? 0;

    if (enableTooltip) {
      layer.bindTooltip(`${name}：${value} 件`, {
        direction: 'top',
        sticky: true,
        offset: [0, -4],
        opacity: 1,
        className: 'mountain-tooltip'
      });
    }

    const handlers = {
      click: () => handleMountainClick(feature, layer, onClick)
    };

    if (enableHover) {
      handlers.mouseover = () => handleHover(layer);
      handlers.mouseout = () => resetHover(layer, feature);
    }

    layer.on(handlers);
  };

  const loadMountainBoundaries = async (geojson, onClick = () => {}) => {
    if (mountainLayer.value) {
      map.value.removeLayer(mountainLayer.value);
    }

    mountainLayer.value = L.geoJSON(geojson, {
      style: (feature) => getFeatureStyle(feature),
      onEachFeature: (feature, layer) =>
        setupFeatureLayer(feature, layer, onClick)
    });

    mountainLayer.value.addTo(map.value);
  };

  const getFeatureStyle = (feature) => {
    const name = feature.properties.WKNG_C;
    const mountainData = dataByMountain.value[name];
    const level = mountainData?.level;
    const isSelected = selectedMountain.value === name;
    const isInitial = !selectedMountain.value;

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

  const handleHover = (layer) => {
    layer.setStyle({
      weight: 2,
      color: defaultColor,
      dashArray: '',
      fillOpacity: 1
    });
  };

  const resetHover = (layer, feature) => {
    const style = getFeatureStyle(feature);
    layer.setStyle(style);
  };

  const mapStore = useMapStore();
  const handleMountainClick = async (feature, layer, callback) => {
    resetSelectedMountain();
    clearSelectedOutline();

    selectMountain(feature.properties.WKNG_C);

    drawSelectedOutline(feature);
    emit?.('select-mountain', feature.properties.WKNG_C);
    mapStore.setTaiwanFaded(true);
    callback(feature.properties.WKNG_C);
  };

  const selectMountain = (name) => {
    selectedMountain.value = name;
    updateSelectedMountainStyle();
  };

  const updateSelectedMountainStyle = () => {
    mountainLayer.value.eachLayer((layer) => {
      const name = layer.feature.properties.WKNG_C;
      const isSelected = name === selectedMountain.value;
      const mountainData = dataByMountain.value[name];
      const level = mountainData?.level;

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

  const drawSelectedOutline = async (feature) => {
    const L = window.L || (await import('leaflet'));

    if (selectedOutlineLayer.value) {
      map.value.removeLayer(selectedOutlineLayer.value);
    }

    const shadow = L.geoJSON(feature.geometry, {
      style: {
        color: '#999',
        weight: 5,
        opacity: 0.6,
        fill: false
      }
    }).addTo(map.value);

    const outline = L.geoJSON(feature.geometry, {
      style: {
        color: '#fff',
        weight: 2,
        opacity: 1,
        fill: false
      }
    }).addTo(map.value);

    selectedOutlineLayer.value = L.layerGroup([shadow, outline]).addTo(map.value);
  };

  const clearSelectedOutline = () => {
    if (selectedOutlineLayer.value) {
      map.value.removeLayer(selectedOutlineLayer.value);
      selectedOutlineLayer.value = null;
    }
  };

  const resetSelectedMountain = () => {
    selectedMountain.value = null;

    clearSelectedOutline();

    mountainLayer.value.eachLayer((layer) => {
      const style = getFeatureStyle(layer.feature);
      layer.setStyle(style);
    });

    mapStore.setTaiwanFaded(false);
  };

  return {
    loadMountainBoundaries,
    dataByMountain,
    selectedMountain,
    resetSelectedMountain
  };
}
