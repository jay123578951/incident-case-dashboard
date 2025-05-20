<template>
  <div ref="parkMapContainer" class="absolute left-0 top-0 h-full w-full" />
</template>

<script setup>
import { useLeafletMap } from '@/composables/map/core/useLeafletMap';
import { useParkBoundaryLayer } from '@/composables/map/visual/useParkBoundaryLayer';

const props = defineProps({
  parkData: { type: Object, default: () => ({}) },
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

const parkMapContainer = ref(null);
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

const reloadAgencyGeoJSON = async (newParkData = props.parkData) => {
  try {
    isLoadingGeoJSON.value = true;

    await waitForMapReady(); // 等待地圖準備完成

    // 載入 GeoJSON
    const res = await fetch('/geoJSON/national_park_simplify_filtered.geojson');
    geojson.value = await res.json();

    // 建立對應資料
    dataByPark.value = Object.fromEntries(
      newParkData.map((item) => [
        item.name,
        { value: item.cases, level: item.level }
      ])
    );

    // 初始化邊界
    await initParkBoundaries();
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
