import { useMarkerStore } from '@/stores/marker-store';
import { useFilterStore } from '@/stores/filter-store';
import {
  convertToGeoJSON,
  getFeatures,
  extractMarkerData
} from '@/utils/data-transform/geo-json';
import { applyFilters } from '@/utils/data-transform/marker-filter';

/**
 * 消防栓資料管理
 * 負責管理消防栓資料的過濾、載入等操作
 */
export function useHydrantManager() {
  const markerStore = useMarkerStore();
  const filterStore = useFilterStore();

  const { geoJSON } = storeToRefs(markerStore);
  const { hydrantFilters, getFilterGroups } = storeToRefs(filterStore);
  const filteredMarkers = ref([]);
  const filteredGeoJSON = computed(() =>
    convertToGeoJSON(filteredMarkers.value)
  );

  // 初次與變動時重新過濾
  watch(
    [geoJSON, hydrantFilters],
    ([newGeoJSON]) => {
      if (!newGeoJSON) {
        filteredMarkers.value = [];
        return;
      }

      const { types, flow, repair } = getFilterGroups.value;

      const rawFeatures = getFeatures(newGeoJSON) || [];
      const markers = rawFeatures.map(extractMarkerData);

      filteredMarkers.value = applyFilters(markers, types, {
        enableFlowFilter: !!flow,
        flowType: flow,
        enableRepairFilter: repair
      });
    },
    { immediate: true }
  );

  /**
   * 載入消防栓資料
   */
  const load = async () => {
    await markerStore.fetch();
  };

  return {
    filteredMarkers,
    geoJSON: filteredGeoJSON,
    load
  };
}
