<template>
  <div class="relative h-main-content">
    <div class="absolute right-0 top-0 z-20 flex w-full ps-5 pt-5">
      <FormsAreaSelect v-model="selectedArea" />

      <FormsSearchFilter
        v-model:selectedItem="selectedMarker"
        :items="original"
        :no-data-text="noDataText"
      />
    </div>

    <Map
      ref="mapRef"
      :marker-data="filteredGeoJSON"
      :selected-area="selectedArea"
    />
  </div>
</template>

<script setup>
definePageMeta({
  title: '轄區水源'
});

import { ref, watch, onMounted, computed } from 'vue';
import { storeToRefs } from 'pinia';

import { useFilterStore } from '@/stores/filter-store';
import { useMapViewStore } from '@/stores/map-view-store';
import { useHydrantManager } from '~/composables/map/data/hydrant/useHydrantManager';
import { useMarkerStore } from '@/stores/marker-store';

// 取得 store 狀態
const mapViewStore = useMapViewStore();
const filterStore = useFilterStore();
const markerStore = useMarkerStore();
const { hydrantFilters, getActiveTypes } = storeToRefs(filterStore);
const { original } = storeToRefs(markerStore);

// 載入 hydrant 管理器
const { load, geoJSON: filteredGeoJSON } = useHydrantManager(hydrantFilters);
const visibleTypes = computed(() => getActiveTypes.value);

// 畫面互動狀態
const selectedMarker = ref(null);
const selectedArea = ref(mapViewStore.selectedArea || '壽豐鄉');
const noDataText = ref('找不到符合的水源');
const mapRef = ref(null);

// 選擇區域後飛到目標並載入 cluster
watch(selectedArea, async (val) => {
  mapViewStore.setSelectedArea(val);

  await mapRef.value?.flyToTown?.(val);
  mapRef.value?.loadMarkersInBounds?.();
});

// 點選 marker 後飛到目標
watch(selectedMarker, (id) => {
  if (!id || !mapRef.value?.focusMarkerById) return;
  mapRef.value.focusMarkerById(id, filteredGeoJSON.value);
  mapViewStore.setSelectedMarker(id);
});

// 初次載入
onMounted(async () => {
  await load();
});
</script>
