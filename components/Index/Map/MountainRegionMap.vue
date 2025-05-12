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

watch(
  () => [isMapReady.value, props.parkData, geojson.value],
  async ([ready, parkData, geo]) => {
    if (ready && parkData?.length && geo && !mapInitialized.value) {
      dataByPark.value = Object.fromEntries(
        parkData.map(item => [item.name, { value: item.cases, level: item.level }])
      );

      await loadParkBoundaries(geo, (name) => {
        console.log('點選縣市：', name);
      });

      mapInitialized.value = true;
    }
  },
  { immediate: true }
);

onMounted(async () => {
  try {
    isLoadingGeoJSON.value = true;
    await createMap(parkMapContainer.value, { showTile: false });

    const res = await fetch('/geoJSON/national_park_simplify_filtered.geojson');
    geojson.value = await res.json();
  } catch (err) {
    console.error('載入台灣邊界失敗:', err);
  } finally {
    isLoadingGeoJSON.value = false;
  }
});

watch(() => props.parkData, (newData) => {
  dataByPark.value = newData;
});

defineExpose({
  resetParkSelection
});
</script>
