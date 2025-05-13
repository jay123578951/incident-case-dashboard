<template>
  <div ref="mapContainer" class="w-full h-full" />
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
const mapInitialized = ref(false);
const isLoadingGeoJSON = ref(false);
const geojson = ref(null);

const { map, isMapReady, createMap } = useLeafletMap();
const { loadCountyBoundaries, resetCountySelection, dataByCounty, updateAllCountyStyles } = useCountyBoundaryLayer(map, emit, props.options);

watch(
  () => [isMapReady.value, props.mapData, geojson.value],
  async ([ready, taiwanData, geo]) => {
    if (ready && taiwanData?.length && geo && !mapInitialized.value) {
      dataByCounty.value = Object.fromEntries(
        taiwanData.map(item => [item.name, { value: item.cases, level: item.level }])
      );

      await loadCountyBoundaries(geo, (name) => {
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
    await createMap(mapContainer.value, { showTile: false });

    const res = await fetch('/geoJSON/twCounty2010.geo.json');
    geojson.value = await res.json();
  } catch (err) {
    console.error('載入台灣邊界失敗:', err);
  } finally {
    isLoadingGeoJSON.value = false;
  }
});

defineExpose({
  map,
  resetCountySelection,
  updateAllCountyStyles
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
</style>
