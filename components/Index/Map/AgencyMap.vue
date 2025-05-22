<template>
  <div ref="parkMapContainer" class="absolute left-0 top-0 h-full w-full" />
</template>

<script setup>
import { useLeafletMap } from '@/composables/map/core/useLeafletMap';
import { useParkBoundaryLayer } from '@/composables/map/visual/useParkBoundaryLayer';
import { useMountainBoundaryLayer } from '@/composables/map/visual/useMountainBoundaryLayer';

const props = defineProps({
  parkData: { type: Object, default: () => ({}) },
  mountainData: { type: Object, default: () => ({}) },
  enableHover: { type: Boolean, default: true },
  enableTooltip: { type: Boolean, default: true }
});

const emit = defineEmits(['select-park']);

const { map, isMapReady, createMap } = useLeafletMap();
const { loadParkBoundaries, dataByPark, resetSelectedPark } =
  useParkBoundaryLayer(map, emit, {
    enableHover: props.enableHover,
    enableTooltip: props.enableTooltip
  });
const { loadMountainBoundaries, dataByMountain, selectedMountain, resetSelectedMountain } =
  useMountainBoundaryLayer(map, emit, {
    enableHover: props.enableHover,
    enableTooltip: props.enableTooltip
  });

const parkMapContainer = ref(null);
const parkGeoJSON = ref(null);
const mountainGeoJSON = ref(null);
const isLoadingGeoJSON = ref(false);
const geojson = ref(null);

/**
 * 初始化公園邊界圖層
 */
const initParkBoundaries = async () => {
  if (!map.value || !isMapReady.value || !geojson.value || !dataByPark.value) {
    console.warn('初始化公園圖層失敗：條件不符');
    return;
  }

  await loadParkBoundaries(geojson.value);

  // 載入後再 reset 樣式
  resetSelectedPark();
};

const reloadAgencyGeoJSON = async ({
  parkData = props.parkData,
  mountainData = props.mountainData
} = {}) => {
  try {
    isLoadingGeoJSON.value = true;

    await waitForMapReady(); // 等待地圖準備完成

    // 載入 GeoJSON
    const [parkRes, mountainRes] = await Promise.all([
      fetch('/geoJSON/national_park_simplify_filtered.geojson'),
      fetch('/geoJSON/forest_simplify_filtered.geojson')
    ]);

    [parkGeoJSON.value, mountainGeoJSON.value] = await Promise.all([
      parkRes.json(),
      mountainRes.json()
    ]);

    // 整理圖層資料
    dataByPark.value = Object.fromEntries(
      parkData.map((item) => [item.name, { value: item.cases, level: item.level }])
    );

    dataByMountain.value = Object.fromEntries(
      mountainData.map((item) => [item.name, { value: item.cases, level: item.level }])
    );

    // 初始化邊界
    await loadMountainBoundaries(mountainGeoJSON.value);
    await loadParkBoundaries(parkGeoJSON.value);
  } catch (err) {
    console.error('重新載入公園圖層失敗:', err);
  } finally {
    isLoadingGeoJSON.value = false;
  }
};

const waitForMapReady = async () => {
  while (!isMapReady.value) {
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
};

onMounted(async () => {
  try {
    isLoadingGeoJSON.value = true;
    await createMap(parkMapContainer.value, { showTile: false });

    const res = await fetch('/geoJSON/national_park_simplify_filtered.geojson');
    geojson.value = await res.json();

    await initParkBoundaries();
  } catch (err) {
    console.error('載入公園圖層失敗:', err);
  } finally {
    isLoadingGeoJSON.value = false;
  }
});

defineExpose({
  resetSelectedPark,
  reloadAgencyGeoJSON
});
</script>

<style>
.leaflet-tooltip.mountain-tooltip,
.leaflet-tooltip.park-tooltip {
  font-size: 18px;
  color: #1c202e;
  background-color: #fff;
  border: 1px solid #ccc;
  padding: 4px 8px;
  border-radius: 4px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  font-weight: bold;
}
</style>
