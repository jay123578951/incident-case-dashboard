import { ref, computed, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useBuildingStore } from '@/stores/buildingStore';
import { useFilterStore } from '@/stores/filter-store';
import {
  convertToGeoJSON,
  getFeatures,
  extractMarkerData
} from '@/utils/data-transform/geo-json';
import { applyFilters } from '@/utils/data-transform/marker-filter';

export function useBuildingManager() {
  const buildingStore = useBuildingStore();
  const filterStore = useFilterStore();

  const { geoJSON } = storeToRefs(buildingStore);
  const { buildingFilters } = storeToRefs(filterStore);

  const filteredMarkers = ref([]);

  watch(
    [geoJSON, buildingFilters],
    ([newGeoJSON, newFilters]) => {
      if (!newGeoJSON || !newFilters) return;

      const rawFeatures = getFeatures(newGeoJSON) || [];
      const markers = rawFeatures.map(extractMarkerData);

      filteredMarkers.value = applyFilters(markers, newFilters, {
        // 如果有 flow / repair 條件可以打開
        enableFlowFilter: false,
        enableRepairFilter: false
      });
    },
    { immediate: true }
  );

  const filteredGeoJSON = computed(() =>
    convertToGeoJSON(filteredMarkers.value)
  );

  const load = async () => {
    await buildingStore.fetch();
  };

  return {
    filteredMarkers,
    geoJSON: filteredGeoJSON,
    load
  };
}
