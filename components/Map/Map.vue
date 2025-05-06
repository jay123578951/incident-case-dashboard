<template>
  <div class="relative h-full w-full">
    <div v-if="isLoadingMap" class="absolute inset-0 z-40 bg-white">
      <v-skeleton-loader
        class="mx-auto"
        type="image, article"
      ></v-skeleton-loader>
    </div>

    <div class="absolute right-4 top-7 z-20">
      <MapControlMenu />
    </div>

    <div class="absolute bottom-7 right-4 z-20">
      <MapSorts />
    </div>

    <div id="map" class="relative z-10 h-full w-full"></div>
  </div>
</template>

<script setup>
import { useMapController } from '@/composables/map/controller/useMapController';
import { useMapLifecycle } from '@/composables/map/controller/useMapLifecycle';

const props = defineProps({
  isModalOpen: Boolean,
  markerData: [Array, Object],
  selectedArea: String
});

const emit = defineEmits([
  'mapClick',
  'update:showTownBoundaries',
  'update:showCircles',
  'update:showPolygons'
]);

const mapController = useMapController(props, emit);

const { watchModalOpen, watchMarkerData } = useMapLifecycle(
  props,
  mapController
);

// 執行初始化監聽
watchModalOpen();
watchMarkerData();

const hasLoadedData = computed(() => {
  return props.markerData?.features?.length > 0;
});

const hasMovedToTarget = ref(false);

const isLoadingMap = computed(() => {
  return (
    !mapController.isMapReady.value ||
    !hasLoadedData.value ||
    !hasMovedToTarget.value
  );
});

// 初始化並觸發 flyToTown（同時監控 moveend 結束）
onMounted(async () => {
  await mapController.initMap();

  const waitUntilMapReady = async (timeout = 3000) => {
    const start = Date.now();
    while (!mapController.isMapReady.value) {
      if (Date.now() - start > timeout) throw new Error('Map still not ready');
      await new Promise((r) => setTimeout(r, 50));
    }
  };

  try {
    await waitUntilMapReady();

    if (props.selectedArea) {
      await mapController.flyToTown(props.selectedArea); // ⬅️ 飛行動畫結束
    }

    hasMovedToTarget.value = true; // ✅ 飛完再設 true
  } catch (err) {
    console.warn('初始化 map 錯誤:', err);
  }
});

onUnmounted(() => {
  mapController.destroyMap();
});

// 對外暴露控制方法
defineExpose({
  focusMarkerById: mapController.focusMarkerById,
  flyToTown: mapController.flyToTown,
  isMapReady: mapController.isMapReady,
  loadMarkersInBounds: mapController.loadMarkersInBounds
});
</script>
