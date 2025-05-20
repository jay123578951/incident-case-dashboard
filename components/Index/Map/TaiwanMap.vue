<template>
  <div ref="mapContainer" class="h-full w-full" />
</template>

<script setup>
import { useLeafletMap } from '@/composables/map/core/useLeafletMap';
import { useCountyBoundaryLayer } from '@/composables/map/visual/useCountyBoundaryLayer';

const props = defineProps({
  mapData: {
    type: Array,
    required: true
  },
  options: {
    type: Object,
    default: () => ({})
  }
});

const emit = defineEmits(['select-county']);

const mapContainer = ref(null);
// const mapInitialized = ref(false);
const isLoadingGeoJSON = ref(false);
const geojson = ref(null);

const { map, isMapReady, createMap } = useLeafletMap();
const countyBoundary = useCountyBoundaryLayer(map, emit, props.options);

const initCountyBoundaries = async () => {
  if (
    !map.value ||
    !isMapReady.value ||
    !geojson.value ||
    !props.mapData?.length
  ) {
    console.warn('條件不足，跳過 initCountyBoundaries');
    return;
  }

  // 設定資料
  countyBoundary.dataByCounty.value = Object.fromEntries(
    props.mapData.map((item) => [
      item.name,
      { value: item.cases, level: item.level }
    ])
  );

  // 載入邊界圖層並建立 countyLayer
  await countyBoundary.loadCountyBoundaries(geojson.value);

  // 載入後再 reset 樣式
  countyBoundary.resetCountySelection();
};

const reloadGeoJSON = async () => {
  try {
    isLoadingGeoJSON.value = true;

    await waitForMapReady(); // 等待地圖準備完成

    const res = await fetch('/geoJSON/twCounty.geojson');
    geojson.value = await res.json();

    await initCountyBoundaries(); // 載入邊界圖層
  } catch (err) {
    console.error('重新載入台灣邊界失敗:', err);
  } finally {
    isLoadingGeoJSON.value = false;
  }
};

const waitForMapReady = async () => {
  while (!isMapReady.value) {
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
};

// watch(
//   () => [isMapReady.value, props.mapData, geojson.value],
//   async ([ready, taiwanData, geo]) => {
//     if (ready && taiwanData?.length && geo && !mapInitialized.value) {
//       dataByCounty.value = Object.fromEntries(
//         taiwanData.map(item => [item.name, { value: item.cases, level: item.level }])
//       );

//       await loadCountyBoundaries(geo);

//       mapInitialized.value = true;
//     }
//   },
//   { immediate: true }
// );

onMounted(async () => {
  try {
    isLoadingGeoJSON.value = true;
    await createMap(mapContainer.value, { showTile: false });

    const res = await fetch('/geoJSON/twCounty.geojson');
    geojson.value = await res.json();
  } catch (err) {
    console.error('載入台灣邊界失敗:', err);
  } finally {
    isLoadingGeoJSON.value = false;
  }
});

defineExpose({
  map,
  countyBoundary,
  reloadGeoJSON
});
</script>

<style>
.leaflet-container {
  background: transparent;
  width: 100%;
  height: 100%;
  z-index: 0;
}

.leaflet-interactive:focus {
  outline: none;
}

.leaflet-tooltip.county-tooltip {
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
