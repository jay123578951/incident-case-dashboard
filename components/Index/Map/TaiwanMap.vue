<template>
  <div ref="mapContainer" class="w-full h-full" />
</template>

<script setup>
import { useCountyBoundaryLayer } from '@/composables/map/visual/useCountyBoundaryLayer';

const props = defineProps({
  mpaData: {
    type: Array,
    required: true
  }
});

const emit = defineEmits(['select-county']);

const mapContainer = ref(null);
let map = ref(null);
const mapInitialized = ref(false);

const { loadCountyBoundaries, resetCountySelection, dataByCounty } = useCountyBoundaryLayer(map, emit);

watch(
  () => props.mpaData,
  async (newVal) => {
    if (newVal?.length && !mapInitialized.value) {
      dataByCounty.value = Object.fromEntries(
        newVal.map(item => [item.name, { value: item.cases, level: item.level }])
      );

      if (!map.value) {
        const L = await import('leaflet');
        map.value = L.map(mapContainer.value, {
          center: [23.6, 121],
          zoom: 7.8,
          zoomControl: false,         // 禁用右上角的 + / - 控制鈕
          scrollWheelZoom: false,     // 禁用滑鼠滾輪縮放
          doubleClickZoom: false,     // 禁用雙擊放大
          boxZoom: false,             // 禁用框選縮放
          touchZoom: false,           // 禁用手勢縮放（手機）
          attributionControl: false,  // 禁用地圖來源
          zoomSnap: 0,
          zoomDelta: 0.25,
          maxBounds: [[20.5, 117.5], [26.5, 123.5]]
        });
        map.value.options.maxBoundsViscosity = 1.0;
      }

      await loadCountyBoundaries((name) => {
        console.log('點選縣市：', name);
      });

      mapInitialized.value = true;
    }
  },
  { immediate: true }
);

defineExpose({
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
