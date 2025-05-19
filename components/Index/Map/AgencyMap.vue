<template>
  <div ref="parkMapContainer" class="absolute top-0 left-0 w-full h-full" />
</template>

<script setup>
import { useLeafletMap } from '@/composables/map/core/useLeafletMap';
import { useParkBoundaryLayer } from '@/composables/map/visual/useParkBoundaryLayer';

const props = defineProps({
  // map: { type: Object, required: true },
  parkData: { type: Object, default: () => ({}) },
  enableHover: { type: Boolean, default: true },
  enableTooltip: { type: Boolean, default: true }
});

const emit = defineEmits(['select-park']);

const { map, isMapReady, createMap } = useLeafletMap();
const {
  loadParkBoundaries,
  dataByPark,
  resetParkSelection
} = useParkBoundaryLayer(map, emit, {
  enableHover: props.enableHover,
  enableTooltip: props.enableTooltip
});

const parkMapContainer = ref(null);
const mapInitialized = ref(false);
const isLoadingGeoJSON = ref(false);
const geojson = ref(null);

// watch(
//   () => [isMapReady.value, props.parkData, geojson.value],
//   async ([ready, parkData, geo]) => {
//     if (ready && parkData?.length && geo && !mapInitialized.value) {
//       dataByPark.value = Object.fromEntries(
//         parkData.map(item => [item.name, { value: item.cases, level: item.level }])
//       );

//       await loadParkBoundaries(geo);

//       mapInitialized.value = true;
//     }
//   },
//   { immediate: true }
// );

/**
 * 初始化公園邊界圖層
 */
const initParkBoundaries = async () => {
  if (!map.value || !isMapReady.value || !geojson.value || !dataByPark.value) {
    console.warn('初始化公園圖層失敗：條件不符');
    return;
  }

  await loadParkBoundaries(geojson.value);
};

/**
 * 由外部主動呼叫的 reload 方法
 */
const reloadAgencyGeoJSON = async (newParkData = props.parkData) => {
  try {
    isLoadingGeoJSON.value = true;

    // 建立地圖（如尚未建立）
    if (!map.value) {
      await createMap(parkMapContainer.value, { showTile: false });
    }

    // 載入 GeoJSON
    const res = await fetch('/geoJSON/national_park_simplify_filtered.geojson');
    geojson.value = await res.json();

    // 建立對應資料
    dataByPark.value = Object.fromEntries(
      newParkData.map(item => [item.name, { value: item.cases, level: item.level }])
    );

    // 初始化邊界
    await initParkBoundaries();
  } catch (err) {
    console.error('重新載入公園圖層失敗:', err);
  } finally {
    isLoadingGeoJSON.value = false;
  }
};

// onMounted(async () => {
//   try {
//     isLoadingGeoJSON.value = true;
//     await createMap(parkMapContainer.value, { showTile: false });

//     const res = await fetch('/geoJSON/national_park_simplify_filtered.geojson');
//     geojson.value = await res.json();
//   } catch (err) {
//     console.error('載入公園圖層失敗:', err);
//   } finally {
//     isLoadingGeoJSON.value = false;
//   }
// });

defineExpose({
  resetParkSelection,
  reloadAgencyGeoJSON
});
</script>
