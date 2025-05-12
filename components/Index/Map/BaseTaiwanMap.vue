<template>
  <div ref="mapContainer" class="w-full h-full relative">
    <slot :map="map" /> <!-- 可用於額外圖層插槽，傳入 map -->
  </div>
</template>

<script setup>
import { useLeafletMap } from '@/composables/map/core/useLeafletMap';
import { useCountyBoundaryLayer } from '@/composables/map/visual/useCountyBoundaryLayer';
import { shallowRef, ref, watch, watchEffect, onMounted } from 'vue';

const props = defineProps({
  mapData: {
    type: Array,
    default: () => []
  },
  options: {
    type: Object,
    default: () => ({})
  },
  enableClick: {
    type: Boolean,
    default: true
  },
  enableHover: {
    type: Boolean,
    default: true
  },
  enableTooltip: {
    type: Boolean,
    default: true
  },
  enableCountyData: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['select-county']);

const mapContainer = ref(null);
const isLoadingGeoJSON = ref(false);
const geojson = ref(null);
const mapInitialized = ref(false);
const map = shallowRef(null); // ✅ 每個元件一個獨立地圖實例

const localDataByCounty = shallowRef({}); // ✅ 每張地圖自己一份

const {
  loadCountyBoundaries,
  resetCountySelection
} = useCountyBoundaryLayer(map, emit, {
  ...props.options,
  enableHover: props.enableHover,
  enableTooltip: props.enableTooltip,
  enableClick: props.enableClick,
  dataByCounty: localDataByCounty
});

const { createMap } = useLeafletMap();

onMounted(async () => {
  try {
    isLoadingGeoJSON.value = true;
    await createMap(mapContainer.value, { showTile: false });
    map.value = mapContainer.value._leaflet_map;

    const res = await fetch('/geoJSON/twCounty2010.geo.json');
    geojson.value = await res.json();
  } catch (err) {
    console.error('載入台灣邊界失敗:', err);
  } finally {
    isLoadingGeoJSON.value = false;
  }
});

watch(
  () => props.mapData,
  (data) => {
    if (props.enableCountyData && data?.length) {
      localDataByCounty.value = Object.fromEntries(
        data.map(item => [item.name, { value: item.cases, level: item.level }])
      );
    } else {
      localDataByCounty.value = {};
    }
  },
  { immediate: true }
);

watchEffect(() => {
  if (map.value && geojson.value && !mapInitialized.value) {
    loadCountyBoundaries(geojson.value);
    mapInitialized.value = true;
  }
});

defineExpose({
  map,
  resetCountySelection
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
